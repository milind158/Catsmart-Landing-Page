"""CATS product film: one continuous shot, built and rendered entirely from this script.

STAND-IN: the device here is a generic model, not CATS hardware. Replace build_device()
with imported CAD and keep the same layer names and the rest of the film still works.

Render from the repo root:
  blender -b --factory-startup -P tools/film/film.py -- render --variant desktop --out <dir>
  blender -b --factory-startup -P tools/film/film.py -- render --variant mobile --frames 1,60,100 --out <dir>

Every frame is a pure function of its time (apply_frame), so any frame can be re-rendered alone.
Times below are in beats. A file's number is two per beat (see beat_of), which is what keeps scrolling
smooth, and those numbers are shared with src/film/scenes.ts: change them in both places.
"""
import bmesh
import json
import math
import os
import random
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

SCENE_NAME = "CATS Film"

# Beat ranges, inclusive. TURN is outside the film: the hero's pointer-driven turn.
REVEAL = (1, 36)
TEARDOWN = (37, 116)
LIGHT = (117, 196)
TECH = (197, 346)
SCREEN = (347, 416)
CLOSE = (417, 496)
TURN = (501, 517)
TURN_DEGREES = 9

SECTIONS = {"reveal": REVEAL, "teardown": TEARDOWN, "light": LIGHT, "technologies": TECH, "screen": SCREEN, "close": CLOSE, "turn": TURN}

VARIANTS = {
    "desktop": {"width": 1920, "height": 1080, "step": 1},
    "mobile": {"width": 720, "height": 1280, "step": 2},
}

AMBER = (1.0, 0.46, 0.13)
IVORY = (1.0, 0.86, 0.68)

# Top to bottom of the stack, in signal order.
STAGES = ["detection", "conditioning", "processing", "digitisation", "transmission"]
STAGE_BEATS_START = 85
STAGE_BEATS_STEP = 6

MACRO_X = 100.0
STATION_X0 = 205.0
STATION_STEP = 40.0
SCREEN_X = 500.0
SCREEN_W = 16.0
SCREEN_H = 10.0
SCREEN_HOLD = 396
SCREEN_DISTANCE = {"desktop": 31.5, "mobile": 20.0}


# ---- Maths

def beat_of(number):
    """File 1 is beat 1, file 3 is beat 2, file 2 falls halfway between them."""
    return (number + 1) / 2


def number_of(beat):
    return beat * 2 - 1


def clamp01(x):
    return max(0.0, min(1.0, x))


def smooth(a, b, x):
    t = clamp01((x - a) / (b - a))
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def catmull(p0, p1, p2, p3, t):
    t2, t3 = t * t, t * t * t
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)


def sample_keys(keys, frame):
    """Catmull-Rom through (frame, loc, target, lens, sx, sy) keys, clamped at both ends."""
    if frame <= keys[0][0]:
        return keys[0][1:]
    if frame >= keys[-1][0]:
        return keys[-1][1:]
    i = next(n for n in range(len(keys) - 1) if keys[n][0] <= frame <= keys[n + 1][0])
    a, b = keys[i], keys[i + 1]
    before, after = keys[max(i - 1, 0)], keys[min(i + 2, len(keys) - 1)]
    t = (frame - a[0]) / (b[0] - a[0])
    out = []
    for n in range(1, 6):
        if n <= 2:
            out.append(tuple(catmull(before[n][c], a[n][c], b[n][c], after[n][c], t) for c in range(3)))
        else:
            out.append(catmull(before[n], a[n], b[n], after[n], t))
    return out


# ---- Materials

def principled(name, color, metallic=0.0, roughness=0.5, specular=0.5):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    node = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    node.inputs["Base Color"].default_value = (*color, 1)
    node.inputs["Metallic"].default_value = metallic
    node.inputs["Roughness"].default_value = roughness
    node.inputs["Specular IOR Level"].default_value = specular
    return mat


def emissive(name, color, strength=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    tree = mat.node_tree
    tree.nodes.clear()
    emit = tree.nodes.new("ShaderNodeEmission")
    out = tree.nodes.new("ShaderNodeOutputMaterial")
    emit.inputs["Color"].default_value = (*color, 1)
    emit.inputs["Strength"].default_value = strength
    tree.links.new(emit.outputs[0], out.inputs["Surface"])
    return mat


def set_glow(mat, strength, color=None):
    emit = next(n for n in mat.node_tree.nodes if n.type == "EMISSION")
    emit.inputs["Strength"].default_value = strength
    if color:
        emit.inputs["Color"].default_value = (*color, 1)


def veil_material():
    mat = bpy.data.materials.new("veil")
    mat.use_nodes = True
    tree = mat.node_tree
    tree.nodes.clear()
    emit = tree.nodes.new("ShaderNodeEmission")
    clear = tree.nodes.new("ShaderNodeBsdfTransparent")
    mix = tree.nodes.new("ShaderNodeMixShader")
    out = tree.nodes.new("ShaderNodeOutputMaterial")
    tree.links.new(clear.outputs[0], mix.inputs[1])
    tree.links.new(emit.outputs[0], mix.inputs[2])
    tree.links.new(mix.outputs[0], out.inputs["Surface"])
    mat.surface_render_method = "BLENDED"
    return mat


# ---- Geometry helpers

def add_box(bm, center, size):
    geom = bmesh.ops.create_cube(bm, size=1.0)
    for v in geom["verts"]:
        v.co = Vector((v.co.x * size[0] + center[0], v.co.y * size[1] + center[1], v.co.z * size[2] + center[2]))


def add_cylinder(bm, center, radius, depth, segments=20, axis="Z"):
    geom = bmesh.ops.create_cone(bm, cap_ends=True, segments=segments, radius1=radius, radius2=radius, depth=depth)
    for v in geom["verts"]:
        x, y, z = v.co
        if axis == "Y":
            x, y, z = x, z, y
        elif axis == "X":
            x, y, z = z, y, x
        v.co = Vector((x + center[0], y + center[1], z + center[2]))


def add_trace(bm, points, width, z):
    half = width / 2
    for a, b in zip(points, points[1:]):
        dx, dy = b[0] - a[0], b[1] - a[1]
        length = math.hypot(dx, dy) or 1
        nx, ny = -dy / length * half, dx / length * half
        ex, ey = dx / length * half, dy / length * half
        verts = [bm.verts.new(p) for p in (
            (a[0] + nx - ex, a[1] + ny - ey, z), (a[0] - nx - ex, a[1] - ny - ey, z),
            (b[0] - nx + ex, b[1] - ny + ey, z), (b[0] + nx + ex, b[1] + ny + ey, z),
        )]
        bm.faces.new(verts)


def route(rng, half_w, half_h, steps=5):
    """A believable PCB route: straight runs joined by 45 degree bends."""
    x, y = rng.uniform(-half_w, half_w), rng.uniform(-half_h, half_h)
    angle = rng.choice([0, 90, 180, 270])
    points = [(x, y)]
    for _ in range(rng.randint(3, steps)):
        length = rng.uniform(0.08, 0.5)
        x += math.cos(math.radians(angle)) * length
        y += math.sin(math.radians(angle)) * length
        x, y = max(-half_w, min(half_w, x)), max(-half_h, min(half_h, y))
        points.append((x, y))
        angle += rng.choice([-45, 45])
    return points


def finish_mesh(bm, name, mat, collection, parent=None, bevel=0.0, smooth_shade=False):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    if smooth_shade:
        mesh.polygons.foreach_set("use_smooth", [True] * len(mesh.polygons))
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    mesh.materials.append(mat)
    obj.parent = parent
    if bevel:
        mod = obj.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
        mod.limit_method = "ANGLE"
    return obj


def make_curve(name, points, radius, mat, collection, parent=None):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    curve.use_fill_caps = True
    curve.bevel_factor_mapping_end = "SPLINE"
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, co in zip(spline.points, points):
        point.co = (*co, 1)
    obj = bpy.data.objects.new(name, curve)
    collection.objects.link(obj)
    curve.materials.append(mat)
    obj.parent = parent
    return obj


def empty(name, collection, parent=None):
    obj = bpy.data.objects.new(name, None)
    collection.objects.link(obj)
    obj.parent = parent
    return obj


# ---- The film's objects, kept here so apply_frame can reach them

class Film:
    pass


F = Film()


# ---- Device set

def build_board(index, stage, collection, parent, mats):
    root = empty(f"board_{stage}", collection, parent)
    rng = random.Random(40 + index)
    half_w, half_h = 1.04, 0.64
    top = 0.016

    bm = bmesh.new()
    add_box(bm, (0, 0, 0), (2.16, 1.36, 0.028))
    for x in (-1.0, 1.0):
        for y in (-0.6, 0.6):
            add_cylinder(bm, (x, y, 0.0005), 0.028, 0.03, 12)
    finish_mesh(bm, f"{stage}_substrate", mats["solder"], collection, root)

    bm = bmesh.new()
    for _ in range(110):
        add_trace(bm, route(rng, half_w, half_h), rng.choice([0.003, 0.004, 0.004, 0.007]), top + 0.0006)
    if stage == "digitisation":
        # Parallel bus lanes between the converters.
        for lane in range(36):
            y = -0.3 + lane * 0.017
            add_trace(bm, [(-0.9, y), (-0.25, y), (0.0, y * 0.4), (0.8, y * 0.4)], 0.005, top + 0.0006)
    finish_mesh(bm, f"{stage}_copper", mats["copper"], collection, root)

    glow = emissive(f"{stage}_glow", AMBER, 0.0)
    bm = bmesh.new()
    for _ in range(34):
        add_trace(bm, route(rng, half_w, half_h, 7), 0.006, top + 0.0012)
    finish_mesh(bm, f"{stage}_signal", glow, collection, root)

    package = bmesh.new()
    metal = bmesh.new()
    # Small passives everywhere, so the board reads as dense at any distance.
    for _ in range(120):
        x, y = rng.uniform(-half_w, half_w), rng.uniform(-half_h, half_h)
        w, d = rng.choice([(0.03, 0.016), (0.02, 0.012), (0.045, 0.024)])
        if rng.random() < 0.5:
            w, d = d, w
        add_box(package, (x, y, top + 0.008), (w, d, 0.016))

    if stage == "detection":
        for n in range(4):
            x = -0.72 + n * 0.48
            add_cylinder(metal, (x, -0.42, top + 0.05), 0.095, 0.1, 28)
            add_cylinder(metal, (x, -0.42, top + 0.11), 0.07, 0.02, 28)
            lens = bmesh.new()
            add_cylinder(lens, (x, -0.42, top + 0.122), 0.05, 0.004, 24)
            finish_mesh(lens, f"lens_{n}", glow, collection, root)
            add_box(package, (x, 0.1, top + 0.016), (0.2, 0.2, 0.03))
    elif stage == "conditioning":
        for n in range(4):
            x = -0.72 + n * 0.48
            for row in range(3):
                add_box(package, (x, -0.35 + row * 0.3, top + 0.016), (0.2, 0.11, 0.03))
                for pin in range(4):
                    add_box(metal, (x - 0.07 + pin * 0.047, -0.35 + row * 0.3 - 0.065, top + 0.005), (0.016, 0.03, 0.008))
                    add_box(metal, (x - 0.07 + pin * 0.047, -0.35 + row * 0.3 + 0.065, top + 0.005), (0.016, 0.03, 0.008))
    elif stage == "processing":
        add_box(package, (0.0, 0.0, top + 0.02), (0.62, 0.62, 0.04))
        add_box(metal, (0.0, 0.0, top + 0.046), (0.46, 0.46, 0.012))
        for n in range(4):
            add_box(package, (-0.72 + n * 0.08 * 0, -0.42 + n * 0.28, top + 0.016), (0.32, 0.17, 0.03))
            add_box(package, (0.72, -0.42 + n * 0.28, top + 0.016), (0.32, 0.17, 0.03))
    elif stage == "digitisation":
        for n in range(4):
            add_box(package, (-0.72 + n * 0.48, 0.4, top + 0.016), (0.26, 0.26, 0.03))
        add_box(metal, (0.82, -0.38, top + 0.022), (0.2, 0.14, 0.04))
    else:
        add_box(package, (0.2, 0.0, top + 0.05), (1.1, 0.8, 0.1))
        add_box(package, (-0.75, -0.3, top + 0.016), (0.3, 0.3, 0.03))
        add_cylinder(metal, (0.9, 0.5, top + 0.03), 0.05, 0.06, 20)

    finish_mesh(package, f"{stage}_packages", mats["package"], collection, root, bevel=0.002)
    finish_mesh(metal, f"{stage}_metal", mats["metal"], collection, root, bevel=0.002)
    return root, glow


def build_device(collection, mats):
    """STAND-IN device. Real CAD replaces this function."""
    root = empty("device", collection)

    bm = bmesh.new()
    wall = 0.05
    add_box(bm, (0, 0, 0.03), (2.4, 1.6, 0.06))
    add_box(bm, (0, -0.8 + wall / 2, 0.17), (2.4, wall, 0.3))
    add_box(bm, (0, 0.8 - wall / 2, 0.17), (2.4, wall, 0.3))
    add_box(bm, (-1.2 + wall / 2, 0, 0.17), (wall, 1.6, 0.3))
    add_box(bm, (1.2 - wall / 2, 0, 0.17), (wall, 1.6, 0.3))
    finish_mesh(bm, "tray", mats["anodised"], collection, root, bevel=0.012)

    lid = empty("lid", collection, root)
    bm = bmesh.new()
    add_box(bm, (0, 0, 0.0), (2.4, 1.6, 0.05))
    for n in range(45):
        add_box(bm, (-1.1 + n * 0.05, 0.12, 0.04), (0.024, 1.24, 0.034))
    finish_mesh(bm, "lid_shell", mats["anodised"], collection, lid, bevel=0.008)
    bm = bmesh.new()
    add_box(bm, (0, -0.68, 0.028), (2.2, 0.03, 0.006))
    finish_mesh(bm, "lid_inlay", mats["metal"], collection, lid)

    F.led = emissive("led", AMBER, 0.0)
    bm = bmesh.new()
    add_box(bm, (0.72, -0.802, 0.26), (0.62, 0.006, 0.012))
    finish_mesh(bm, "led_strip", F.led, collection, root)

    bm = bmesh.new()
    glow_ports = bmesh.new()
    for n in range(4):
        x = -0.92 + n * 0.28
        add_cylinder(bm, (x, -0.85, 0.17), 0.075, 0.12, 24, "Y")
        add_cylinder(bm, (x, -0.92, 0.17), 0.05, 0.06, 24, "Y")
        add_cylinder(glow_ports, (x, -0.956, 0.17), 0.024, 0.006, 20, "Y")
    finish_mesh(bm, "ports", mats["metal"], collection, root, bevel=0.004)
    F.port_glow = emissive("port_glow", AMBER, 0.0)
    finish_mesh(glow_ports, "port_cores", F.port_glow, collection, root)

    # Fibres run off towards the camera and out of frame.
    F.fibre_glow = emissive("fibre_glow", AMBER, 0.0)
    F.fibres = []
    for n in range(4):
        x = -0.92 + n * 0.28
        points = [(x, -0.95, 0.17), (x, -1.3, 0.14), (x - 0.15 - n * 0.05, -1.9, 0.06), (x - 0.5 - n * 0.12, -3.0, 0.03), (x - 1.6 - n * 0.2, -7.0, 0.03), (x - 3.5 - n * 0.2, -14.0, 0.03)]
        make_curve(f"fibre_{n}", points, 0.0085, mats["jacket"], collection, root)
        F.fibres.append(make_curve(f"fibre_core_{n}", [(p[0], p[1], p[2] + 0.001) for p in points], 0.0095 , F.fibre_glow, collection, root))

    F.boards = {}
    F.board_glow = {}
    for index, stage in enumerate(STAGES):
        board, glow = build_board(index, stage, collection, root, mats)
        F.boards[stage] = board
        F.board_glow[stage] = glow

    F.device = root
    F.lid = lid

    floor = bmesh.new()
    add_box(floor, (0, 0, -0.5), (120, 120, 1.0))
    finish_mesh(floor, "floor", mats["floor"], collection)

    rim = bpy.data.lights.new("rim", "AREA")
    rim.shape = "RECTANGLE"
    rim.size, rim.size_y = 9.0, 0.5
    rim.color = (1.0, 0.82, 0.62)
    F.rim = bpy.data.objects.new("rim", rim)
    collection.objects.link(F.rim)

    key = bpy.data.lights.new("key", "AREA")
    key.size = 6.0
    key.color = (0.82, 0.88, 1.0)
    F.key = bpy.data.objects.new("key", key)
    F.key.location = (-3.5, -4.5, 6.5)
    collection.objects.link(F.key)
    aim(F.key, (0, 0, 0.5))

    core = bpy.data.lights.new("core", "POINT")
    core.color = AMBER
    core.shadow_soft_size = 0.5
    F.core = bpy.data.objects.new("core", core)
    collection.objects.link(F.core)
    F.core.parent = root


def aim(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


# ---- Macro set: inside the board, where one beam becomes four channels and then data

def build_macro(collection, mats):
    root = empty("macro", collection)
    rng = random.Random(7)

    bm = bmesh.new()
    add_box(bm, (MACRO_X + 40, 0, -0.5), (120, 40, 1.0))
    finish_mesh(bm, "macro_ground", mats["solder_gloss"], collection, root)

    bm = bmesh.new()
    for lane in range(70):
        y = -9 + lane * 0.26
        if abs(y) < 2.1:
            continue
        x = MACRO_X - 6
        points = [(x, y)]
        while x < MACRO_X + 80:
            x += rng.uniform(5, 16)
            y += rng.choice([-0.26, 0, 0, 0.26])
            points.append((x - 0.26, points[-1][1]))
            points.append((x, y))
        add_trace(bm, points, 0.05, 0.002)
    finish_mesh(bm, "macro_copper", mats["copper"], collection, root)

    F.channel_glow = emissive("channel", AMBER, 9.0)
    F.data_glow = emissive("data", IVORY, 10.0)
    channels = (-1.5, -0.5, 0.5, 1.5)
    F.beam_in = make_curve("beam_in", [(MACRO_X - 8, 0, 0.3), (MACRO_X + 8, 0, 0.3)], 0.05, F.channel_glow, collection, root)

    F.analog = []
    F.digital = []
    for n, y in enumerate(channels):
        points = [(MACRO_X + 8, 0, 0.3), (MACRO_X + 10, y * 0.4, 0.3), (MACRO_X + 13, y, 0.3)]
        x = MACRO_X + 13
        while x < MACRO_X + 41:
            x += 0.12
            phase = n * 1.3
            points.append((x, y, 0.3 + 0.2 * math.sin(x * (2.2 + n * 0.35) + phase) * math.sin(x * 0.45 + phase)))
        F.analog.append(make_curve(f"analog_{n}", points, 0.018, F.channel_glow, collection, root))

        bits = random.Random(n + 3)
        x = MACRO_X + 44
        level = 0
        points = [(x, y, 0.16)]
        while x < MACRO_X + 79:
            x += bits.choice([0.3, 0.3, 0.6])
            points.append((x, y, 0.16 + level * 0.26))
            level = 1 - level
            points.append((x, y, 0.16 + level * 0.26))
        F.digital.append(make_curve(f"digital_{n}", points, 0.016, F.data_glow, collection, root))

    # The converters: where the analogue channels end and the data starts.
    bm = bmesh.new()
    slit = bmesh.new()
    for y in channels:
        add_box(bm, (MACRO_X + 42.5, y, 0.28), (2.6, 0.72, 0.56))
        add_box(slit, (MACRO_X + 41.18, y, 0.3), (0.02, 0.5, 0.05))
        add_box(slit, (MACRO_X + 43.82, y, 0.3), (0.02, 0.5, 0.05))
    finish_mesh(bm, "macro_adc", mats["package"], collection, root, bevel=0.03)
    finish_mesh(slit, "macro_adc_slit", F.data_glow, collection, root)

    light = bpy.data.lights.new("macro_key", "AREA")
    light.size = 40
    light.color = (0.75, 0.82, 1.0)
    light.energy = 700
    obj = bpy.data.objects.new("macro_key", light)
    obj.location = (MACRO_X + 40, 0, 14)
    collection.objects.link(obj)


# ---- Six stations on one continuous data line

def station_x(index):
    return STATION_X0 + index * STATION_STEP


def build_stations(collection, mats):
    F.line_glow = emissive("data_line", IVORY, 7.0)
    make_curve("data_line", [(MACRO_X + 79, 0, 0.3), (SCREEN_X, 0, 0)], 0.011, F.line_glow, collection)
    F.station_glow = [emissive(f"station_{i}", AMBER, 1.0) for i in range(6)]
    F.station_soft = [emissive(f"station_{i}_soft", IVORY, 1.0) for i in range(6)]
    F.station_reveal = [[] for _ in range(6)]

    # Big Data & Analytics: a surface of points, moving like a field of readings.
    cx = station_x(0)
    for layer, (mat, spacing, offset) in enumerate(((F.station_glow[0], 0.17, -2.0), (F.station_soft[0], 0.34, -0.4))):
        verts, faces = [], []
        count = 130 if layer == 0 else 44
        size = 0.024 if layer == 0 else 0.032
        for ix in range(count):
            for iy in range(count):
                x = (ix - count / 2) * spacing
                y = (iy - count / 2) * spacing + 3.5
                z = offset + 0.8 * math.sin(x * 0.5 + y * 0.2) * math.cos(y * 0.34) + 0.32 * math.sin(x * 1.3 - y * 0.9)
                base = len(verts)
                verts += [(cx + x - size, y - size, z), (cx + x + size, y - size, z), (cx + x + size, y + size, z), (cx + x - size, y + size, z)]
                faces.append((base, base + 1, base + 2, base + 3))
        mesh = bpy.data.meshes.new(f"points_{layer}")
        mesh.from_pydata(verts, [], faces)
        obj = bpy.data.objects.new(f"points_{layer}", mesh)
        mesh.materials.append(mat)
        collection.objects.link(obj)

    # Optoelectronics: a tunnel of fibres converging ahead of the camera on one detector die.
    cx = station_x(1)
    rng = random.Random(21)
    die_x = cx + 11
    for n in range(40):
        angle = n / 40 * math.tau + rng.uniform(-0.05, 0.05)
        radius = rng.uniform(5.5, 10)
        start = (cx - rng.uniform(14, 22), math.cos(angle) * radius, math.sin(angle) * radius)
        end = (die_x, (rng.uniform(-0.7, 0.7)), rng.uniform(-0.7, 0.7))
        points = []
        for step in range(48):
            t = step / 47
            e = t * t * (3 - 2 * t)
            points.append((lerp(start[0], end[0], t), lerp(start[1], end[1], e), lerp(start[2], end[2], e)))
        F.station_reveal[1].append(make_curve(f"opto_{n}", points, 0.012, F.station_glow[1] if n % 3 else F.station_soft[1], collection))
    bm = bmesh.new()
    add_box(bm, (die_x + 0.3, 0, 0), (0.3, 2.6, 2.6))
    finish_mesh(bm, "opto_die", mats["metal"], collection, bevel=0.02)
    bm = bmesh.new()
    for iy in range(8):
        for iz in range(8):
            add_box(bm, (die_x + 0.13, (iy - 3.5) * 0.28, (iz - 3.5) * 0.28), (0.02, 0.22, 0.22))
    finish_mesh(bm, "opto_pixels", F.station_soft[1], collection)

    # Image Processing: lens rings the camera flies through, and detection frames.
    cx = station_x(2)
    for n in range(7):
        radius = 1.3 + (6 - n) * 0.62
        x = cx - 2 + n * 3.0
        bm = bmesh.new()
        geom = bmesh.ops.create_circle(bm, cap_ends=False, segments=96, radius=radius)
        for v in geom["verts"]:
            y, z = v.co.x, v.co.y
            v.co = Vector((x, y, z))
        ring_mesh = bpy.data.curves.new(f"lens_{n}", "CURVE")
        bm.free()
        ring_mesh.dimensions = "3D"
        ring_mesh.bevel_depth = 0.09
        ring_mesh.bevel_resolution = 3
        spline = ring_mesh.splines.new("POLY")
        spline.points.add(95)
        for i, point in enumerate(spline.points):
            a = i / 96 * math.tau
            point.co = (x, math.cos(a) * radius, math.sin(a) * radius, 1)
        spline.use_cyclic_u = True
        ring_mesh.materials.append(mats["metal"])
        collection.objects.link(bpy.data.objects.new(f"lens_{n}", ring_mesh))

        inner = [(x + 0.03, math.cos(i / 96 * math.tau) * (radius - 0.1), math.sin(i / 96 * math.tau) * (radius - 0.1)) for i in range(97)]
        make_curve(f"lens_light_{n}", inner, 0.012, F.station_soft[2], collection)
    bm = bmesh.new()
    for (y, z, w, h) in ((-1.5, 0.9, 1.3, 1.0), (1.2, -1.0, 0.9, 1.4), (2.3, 1.4, 1.1, 0.7), (-2.4, -1.3, 0.7, 0.9)):
        tick = 0.3
        for sy in (-1, 1):
            for sz in (-1, 1):
                add_box(bm, (cx + 20, y + sy * (w / 2 - tick / 2), z + sz * h / 2), (0.01, tick, 0.02))
                add_box(bm, (cx + 20, y + sy * w / 2, z + sz * (h / 2 - tick / 2)), (0.01, 0.02, tick))
    finish_mesh(bm, "detection_frames", F.station_glow[2], collection)

    # Sound Processing: the waveform stands up beside the line.
    cx = station_x(3)
    bm = bmesh.new()
    soft = bmesh.new()
    for n in range(300):
        x = (n - 150) * 0.12
        envelope = math.exp(-((x / 9) ** 2))
        height = 0.12 + 3.4 * envelope * abs(math.sin(x * 0.9) * 0.6 + math.sin(x * 2.3 + 1) * 0.3 + math.sin(x * 5.1) * 0.2)
        target = soft if n % 5 == 0 else bm
        add_box(target, (cx + x, 2.2, 0), (0.05, 0.05, height * 2))
    finish_mesh(bm, "sound_bars", F.station_glow[3], collection)
    finish_mesh(soft, "sound_bars_soft", F.station_soft[3], collection)

    # Command & Control: rings and links on a plane below the line, with a turning sweep.
    cx = station_x(4)
    for n in range(7):
        radius = 2 + n * 1.5
        points = [(cx + math.cos(i / 128 * math.tau) * radius, 2 + math.sin(i / 128 * math.tau) * radius, -1.6) for i in range(129)]
        make_curve(f"control_ring_{n}", points, 0.008, F.station_soft[4], collection)
    rng = random.Random(11)
    nodes = []
    bm = bmesh.new()
    for n in range(11):
        angle, radius = rng.uniform(0, math.tau), rng.uniform(2.5, 10)
        pos = (cx + math.cos(angle) * radius, 2 + math.sin(angle) * radius, -1.6)
        nodes.append(pos)
        add_cylinder(bm, pos, 0.1, 0.04, 16)
    finish_mesh(bm, "control_nodes", F.station_glow[4], collection)
    for n in range(10):
        a, b = nodes[n], nodes[(n * 3 + 4) % 11]
        points = []
        for s in range(30):
            t = s / 29
            points.append((lerp(a[0], b[0], t), lerp(a[1], b[1], t), -1.6 + math.sin(t * math.pi) * 2.2))
        F.station_reveal[4].append(make_curve(f"control_arc_{n}", points, 0.012, F.station_glow[4], collection))
    bm = bmesh.new()
    add_box(bm, (6.5, 0, 0), (13, 0.03, 0.01))
    F.sweep = finish_mesh(bm, "control_sweep", F.station_soft[4], collection)
    F.sweep.location = (cx, 2, -1.58)

    # Research & Customisation: a wafer of dies and one ring resonator holding the light.
    cx = station_x(5)
    bm = bmesh.new()
    add_cylinder(bm, (cx, 3.6, -1.15), 9.0, 0.1, 96)
    finish_mesh(bm, "wafer", mats["wafer"], collection)
    bm = bmesh.new()
    for ix in range(-9, 10):
        for iy in range(-9, 10):
            x, y = ix * 0.92, iy * 0.92
            if math.hypot(x, y) < 8.3:
                add_box(bm, (cx + x, 3.6 + y, -1.08), (0.86, 0.86, 0.02))
    finish_mesh(bm, "wafer_dies", mats["wafer_die"], collection)
    ring = [(cx + 5 + math.cos(i / 128 * math.tau) * 1.7, 1.76 + math.sin(i / 128 * math.tau) * 1.7, -0.9) for i in range(129)]
    make_curve("resonator", ring, 0.03, F.station_glow[5], collection)
    bus = [(cx - 12, 0, -0.9), (cx + 12, 0, -0.9)]
    make_curve("resonator_bus", bus, 0.022, F.station_soft[5], collection)

    light = bpy.data.lights.new("station_key", "AREA")
    light.size = 28
    light.color = (0.85, 0.9, 1.0)
    F.station_key = bpy.data.objects.new("station_key", light)
    collection.objects.link(F.station_key)


# ---- Screen set

def build_screen(collection, mats):
    F.screen_root = empty("screen", collection)
    F.screen_root.location = (SCREEN_X, 0, 0)

    F.screen_light = emissive("screen_light", IVORY, 30.0)
    bm = bmesh.new()
    add_box(bm, (0, 0, 0), (0.04, 1.0, 1.0))
    F.screen_line = finish_mesh(bm, "screen_line", F.screen_light, collection, F.screen_root)

    F.screen_panel_glow = emissive("screen_panel", (0.014, 0.014, 0.016), 1.0)
    bm = bmesh.new()
    add_box(bm, (0.03, 0, 0), (0.02, 1.0, 1.0))
    F.screen_panel = finish_mesh(bm, "screen_panel", F.screen_panel_glow, collection, F.screen_root)

    bm = bmesh.new()
    t = 0.12
    add_box(bm, (0.04, 0, SCREEN_H / 2 + t / 2), (0.2, SCREEN_W + 2 * t, t))
    add_box(bm, (0.04, 0, -SCREEN_H / 2 - t / 2), (0.2, SCREEN_W + 2 * t, t))
    add_box(bm, (0.04, SCREEN_W / 2 + t / 2, 0), (0.2, t, SCREEN_H))
    add_box(bm, (0.04, -SCREEN_W / 2 - t / 2, 0), (0.2, t, SCREEN_H))
    F.screen_bezel = finish_mesh(bm, "screen_bezel", mats["metal"], collection, F.screen_root)

    bm = bmesh.new()
    add_box(bm, (SCREEN_X - 10, 0, -SCREEN_H / 2 - 2.5), (90, 90, 0.2))
    finish_mesh(bm, "screen_floor", mats["floor"], collection)

    light = bpy.data.lights.new("screen_key", "AREA")
    light.size = 30
    light.color = (1.0, 0.86, 0.72)
    F.screen_key = bpy.data.objects.new("screen_key", light)
    F.screen_key.location = (SCREEN_X - 16, 0, 16)
    collection.objects.link(F.screen_key)
    aim(F.screen_key, (SCREEN_X, 0, 0))


# ---- Scene

def build():
    existing = bpy.data.scenes.get(SCENE_NAME)
    if existing:
        bpy.data.scenes.remove(existing)
    scene = bpy.data.scenes.new(SCENE_NAME)
    if bpy.context.window:
        bpy.context.window.scene = scene

    world = bpy.data.worlds.new("film_world")
    world.use_nodes = True
    bg = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs["Color"].default_value = (0.0028, 0.003, 0.0036, 1)
    bg.inputs["Strength"].default_value = 1.0
    scene.world = world

    scene.render.engine = "BLENDER_EEVEE"
    scene.eevee.use_raytracing = True
    scene.eevee.taa_render_samples = 24
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.fps = 24
    scene.view_settings.view_transform = "AgX"
    try:
        scene.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        pass

    mats = {
        "anodised": principled("anodised", (0.018, 0.019, 0.022), 1.0, 0.34),
        "metal": principled("metal", (0.34, 0.33, 0.31), 1.0, 0.32),
        "copper": principled("copper", (0.42, 0.25, 0.1), 1.0, 0.36),
        "solder": principled("solder", (0.005, 0.011, 0.01), 0.0, 0.5, 0.25),
        "solder_gloss": principled("solder_gloss", (0.004, 0.008, 0.008), 0.0, 0.14, 0.7),
        "package": principled("package", (0.01, 0.01, 0.012), 0.0, 0.45, 0.3),
        "jacket": principled("jacket", (0.05, 0.05, 0.055), 0.0, 0.34),
        "floor": principled("floor", (0.004, 0.004, 0.005), 0.0, 0.42, 0.07),
        "wafer": principled("wafer", (0.16, 0.17, 0.21), 0.25, 0.3),
        "wafer_die": principled("wafer_die", (0.26, 0.21, 0.36), 0.3, 0.24),
    }

    sets = {}
    for name in ("device", "macro", "stations", "screen"):
        collection = bpy.data.collections.new(f"film_{name}")
        scene.collection.children.link(collection)
        sets[name] = collection
    F.sets = sets

    build_device(sets["device"], mats)
    build_macro(sets["macro"], mats)
    build_stations(sets["stations"], mats)
    build_screen(sets["screen"], mats)

    cam_data = bpy.data.cameras.new("film_camera")
    cam_data.sensor_fit = "HORIZONTAL"
    cam_data.sensor_width = 36
    cam_data.clip_start = 0.02
    cam_data.clip_end = 140
    F.camera = bpy.data.objects.new("film_camera", cam_data)
    scene.collection.objects.link(F.camera)
    scene.camera = F.camera

    # A plane just in front of the lens: fades, flashes and the final step into daylight.
    F.veil_mat = veil_material()
    bm = bmesh.new()
    add_box(bm, (0, 0, -0.08), (2.0, 2.0, 0.0))
    F.veil = finish_mesh(bm, "veil", F.veil_mat, scene.collection, F.camera)

    setup_compositor(scene)
    F.scene = scene
    return scene


def setup_compositor(scene):
    tree = bpy.data.node_groups.new("film_comp", "CompositorNodeTree")
    tree.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
    layers = tree.nodes.new("CompositorNodeRLayers")
    layers.scene = scene
    glare = tree.nodes.new("CompositorNodeGlare")
    glare.inputs["Type"].default_value = "Bloom"
    glare.inputs["Quality"].default_value = "High"
    glare.inputs["Threshold"].default_value = 0.9
    glare.inputs["Strength"].default_value = 0.7
    glare.inputs["Size"].default_value = 0.7
    out = tree.nodes.new("NodeGroupOutput")
    tree.links.new(layers.outputs["Image"], glare.inputs["Image"])
    tree.links.new(glare.outputs[0], out.inputs[0])
    scene.compositing_node_group = tree
    scene.render.use_compositing = True


# ---- Camera

# frame, location, target, lens, shift x (desktop), shift y (mobile)
DEVICE_KEYS = [
    (1, (-4.4, -6.7, 1.42), (0.0, 0.0, 0.3), 58, -0.13, -0.14),
    (36, (-4.2, -6.4, 1.38), (0.0, 0.0, 0.3), 58, -0.13, -0.14),
    (62, (-6.2, -9.4, 3.0), (0.25, 0.0, 1.3), 58, -0.1, -0.08),
    (85, (-7.9, -12.0, 5.2), (0.7, 0.0, 2.05), 58, -0.14, -0.1),
    (116, (-7.6, -11.6, 5.2), (0.7, 0.0, 2.05), 58, -0.14, -0.1),
]
DIVE_START = 117
DIVE_END = 148
MACRO_START = 149


def close_keys():
    return [
        (417, (7.6, -11.4, 5.4), (0.7, 0.0, 2.05), 58, 0.0, -0.05),
        (440, (6.8, -10.2, 3.6), (0.4, 0.0, 1.3), 58, 0.0, -0.05),
        (472, (5.0, -7.4, 1.5), (0.0, 0.0, 0.32), 58, 0.0, -0.05),
        (496, (4.3, -6.3, 1.25), (0.0, 0.0, 0.34), 58, 0.0, -0.05),
    ]


def dive_keys():
    z = board_z("detection", 116)
    can = (-0.24, -0.42, z + 0.13)
    return [
        (116, (-7.6, -11.6, 5.2), (0.7, 0.0, 2.05), 58, -0.14, -0.1),
        (126, (-4.0, -6.0, z + 1.5), (0.0, -0.2, z), 50, -0.02, 0.0),
        (140, (-0.9, -1.4, z + 0.5), (can[0], can[1], can[2]), 42, 0.0, 0.0),
        (149, (can[0] - 0.02, can[1] - 0.02, can[2] + 0.12), can, 36, 0.0, 0.0),
    ]


def station_camera(frame, variant):
    u = (frame - TECH[0]) / 25
    index = min(5, int(u))
    local = u - index
    centered = 2 * local - 1
    offset = (0.5 * centered ** 3 + 0.5 * centered) * (STATION_STEP / 2)
    x = station_x(index) + offset

    # Per-station height and side offset, blended across each boundary.
    poses = [(-5.5, 1.1), (-1.4, 0.6), (-1.0, 0.55), (-5.0, 0.3), (-7.5, 5.6), (-5.5, 5.0)]
    a = poses[index]
    if local < 0.25:
        b = poses[index - 1] if index else (-1.6, 1.2)
        t = 0.5 + 2 * local
    elif local > 0.75:
        b = poses[index + 1] if index < 5 else (0.0, 0.0)
        t = 0.5 + 2 * (1 - local)
    else:
        b, t = a, 1.0
    t = t * t * (3 - 2 * t)
    y, z = lerp(b[0], a[0], t), lerp(b[1], a[1], t)
    target = (x + 9, 1.1 if abs(y) > 1 else 0.0, -0.15 if z < 3 else -1.3)
    sx = -0.14 if variant == "desktop" else 0.0
    return (x, y, z), target, 30, sx, -0.08 if variant == "mobile" else 0.0


def macro_camera(frame):
    t = clamp01((frame - MACRO_START) / (LIGHT[1] - MACRO_START))
    eased = t * 0.86 + 0.14 * smooth(0, 1, t)
    x = MACRO_X + lerp(-6, 66, eased)
    y = lerp(-1.6, -2.3, smooth(0.3, 1, t))
    z = lerp(0.55, 1.5, smooth(0.0, 0.5, t))
    return (x, y, z), (x + 6, 0.0, 0.25), 30, 0.0, 0.0


def screen_camera(frame, variant):
    d_final = SCREEN_DISTANCE[variant]
    t = smooth(SCREEN[0], SCREEN_HOLD, frame)
    x = lerp(SCREEN_X - 58, SCREEN_X - d_final, t)
    sx = -0.13 if variant == "desktop" else 0.0
    sy = -0.1 if variant == "mobile" else 0.0
    return (x, 0.0, 0.0), (SCREEN_X, 0.0, 0.0), 40, sx * t, sy * t


def camera_at(frame, variant):
    if frame >= TURN[0]:
        return sample_keys(DEVICE_KEYS, 36)
    if frame < DIVE_START:
        return sample_keys(DEVICE_KEYS, frame)
    if frame < MACRO_START:
        return sample_keys(dive_keys(), frame)
    if frame <= LIGHT[1]:
        return macro_camera(frame)
    if frame <= TECH[1]:
        return station_camera(frame, variant)
    if frame <= SCREEN[1]:
        return screen_camera(frame, variant)
    return sample_keys(close_keys(), frame)


# ---- Device state

def explode_amount(frame, stage_index=0):
    """0 is assembled, 1 is fully apart. Layers leave one after another and return in reverse."""
    lift = smooth(44 + stage_index * 4, 82, frame)
    home = 1 - smooth(428 + (4 - stage_index) * 4, 470, frame)
    return lift if frame < 300 else home


def board_z(stage, frame):
    index = STAGES.index(stage)
    assembled = 0.17 - index * 0.026
    apart = 3.1 - index * 0.66
    return lerp(assembled, apart, explode_amount(frame, index))


def lid_state(frame):
    amount = smooth(38, 76, frame) if frame < 300 else 1 - smooth(444, 480, frame)
    return lerp(0.345, 4.25, amount), amount


# ---- A frame

def visible_set(frame):
    if frame >= TURN[0] or frame < MACRO_START or frame >= CLOSE[0]:
        return "device"
    if frame <= LIGHT[1]:
        return "macro"
    if frame <= TECH[1]:
        return "stations"
    return "screen"


def apply_frame(frame, variant="desktop"):
    active = visible_set(frame)
    for name, collection in F.sets.items():
        collection.hide_render = name != active
        collection.hide_viewport = name != active

    loc, target, lens, sx, sy = camera_at(frame, variant)
    F.camera.location = loc
    aim(F.camera, target)
    F.camera.data.lens = lens
    F.camera.data.shift_x = sx if variant == "desktop" else 0.0
    # On desktop the hero sits high in the frame, above the headline, then settles as the film starts.
    hero_lift = -0.09 * (1 - smooth(36, 62, 36 if frame >= TURN[0] else frame))
    F.camera.data.shift_y = sy if variant == "mobile" else hero_lift

    if active == "device":
        apply_device(frame)
    elif active == "macro":
        apply_macro(frame)
    elif active == "stations":
        apply_stations(frame)
    else:
        apply_screen(frame)
    apply_veil(frame)


def apply_device(frame):
    turning = frame >= TURN[0]
    if turning:
        u = (frame - TURN[0]) / (TURN[1] - TURN[0])
        F.device.rotation_euler = (0, 0, math.radians(lerp(-TURN_DEGREES, TURN_DEGREES, u)))
    else:
        F.device.rotation_euler = (0, 0, 0)
    state = 36 if turning else frame

    lid_z, amount = lid_state(state)
    # Out of shot before the dive, so its lit underside never crosses the frame.
    F.lid.location = (0, 0, lid_z + (8 * smooth(117, 128, state) if state < 300 else 0))
    F.lid.rotation_euler = (math.radians(amount * 5), math.radians(-amount * 7), 0)
    for index, stage in enumerate(STAGES):
        F.boards[stage].location = (explode_amount(state, index) * (0.2 * (2 - index)), 0, board_z(stage, state))

    # The rim light crosses behind the device, then rests where it finished.
    sweep = smooth(REVEAL[0], REVEAL[1], min(state, 36))
    side = 1 if state < 300 else -1
    F.rim.location = (lerp(-9, 5.5, sweep) * side, 5.5, 3.4)
    aim(F.rim, (0, 0, 0.3))
    settle = 1.0 if state < 300 else smooth(417, 440, state)
    F.rim.data.energy = lerp(0, 520, smooth(0, 0.15, sweep)) * settle
    F.key.location = (-3.5 * side, -4.5, 6.5)
    aim(F.key, (0, 0, 0.5))
    F.key.data.energy = lerp(0, 34, smooth(10, 36, state)) - 14 * smooth(38, 80, state if state < 300 else 0)

    led = smooth(24, 36, state)
    teardown_glow = smooth(60, 85, state) if state < 300 else 1 - smooth(428, 470, state)
    set_glow(F.led, 5.0 * led + 3.0 * teardown_glow)

    # Stage beats: each layer lights in signal order, then stays gently on.
    for index, stage in enumerate(STAGES):
        beat = STAGE_BEATS_START + index * STAGE_BEATS_STEP
        if state < 300:
            peak = smooth(beat, beat + 3, state) * (1 - 0.55 * smooth(beat + STAGE_BEATS_STEP, beat + STAGE_BEATS_STEP + 4, state))
        else:
            peak = 0.45 * (1 - smooth(440, 470, state))
        set_glow(F.board_glow[stage], 14.0 * peak)

    fibre = smooth(112, 134, state) if state < 300 else 0.0
    set_glow(F.fibre_glow, 7.0 * fibre)
    set_glow(F.port_glow, 5.0 * led + 8.0 * fibre)
    F.core.location = (0, 0, lerp(0.2, 1.8, explode_amount(state, 2)))
    F.core.data.energy = 10 * teardown_glow


def apply_macro(frame):
    t = clamp01((frame - MACRO_START) / (LIGHT[1] - MACRO_START))
    front = lerp(MACRO_X - 2, MACRO_X + 84, t ** 0.9)
    F.beam_in.data.bevel_factor_end = clamp01((front - (MACRO_X - 8)) / 16)
    for curve in F.analog:
        curve.data.bevel_factor_end = clamp01((front - (MACRO_X + 8)) / 33)
    for curve in F.digital:
        curve.data.bevel_factor_end = clamp01((front - (MACRO_X + 44)) / 35)


STATION_STRENGTH = (7.0, 7.0, 7.0, 3.2, 5.5, 7.0)


def apply_stations(frame):
    camera_x = F.camera.location.x
    for index in range(6):
        fade = 1 - smooth(10, 26, abs(camera_x - station_x(index)))
        progress = smooth(-22, 10, camera_x - station_x(index))
        strength = STATION_STRENGTH[index] * fade
        set_glow(F.station_glow[index], strength)
        set_glow(F.station_soft[index], strength * 0.8)
        for curve in F.station_reveal[index]:
            curve.data.bevel_factor_end = progress
    F.sweep.rotation_euler = (0, 0, (frame - TECH[0]) * 0.11)
    F.station_key.location = (camera_x + 8, 0, 16)
    aim(F.station_key, (camera_x + 8, 0, 0))
    F.station_key.data.energy = 1100


def apply_screen(frame):
    grow = smooth(SCREEN[0] + 8, SCREEN[0] + 22, frame)
    open_up = smooth(SCREEN[0] + 20, SCREEN[0] + 40, frame)
    width = max(grow * SCREEN_W, 0.02)
    height = lerp(0.06, SCREEN_H, open_up)

    F.screen_line.scale = (1, width, 0.06 + 0.02 * (1 - grow))
    F.screen_line.location = (0, 0, 0)
    F.screen_panel.scale = (1, width, height)
    F.screen_line.hide_render = open_up > 0.995
    set_glow(F.screen_light, 30 * (1 - 0.8 * open_up))
    set_glow(F.screen_panel_glow, lerp(0.0, 1.0, open_up))
    F.screen_bezel.hide_render = open_up < 0.995
    F.screen_key.data.energy = lerp(0, 1100, open_up)
    set_glow(F.line_glow, 7.0)


def apply_veil(frame):
    """Fade-through moments between sets, then the climb into daylight at the end of the film."""
    amount, color, strength = 0.0, IVORY, 6.0
    if DIVE_END - 8 <= frame <= MACRO_START + 7:
        amount = smooth(DIVE_END - 5, DIVE_END, frame) * (1 - smooth(MACRO_START, MACRO_START + 5, frame))
    elif TECH[0] - 4 <= frame <= TECH[0] + 3:
        amount = 0.0
    elif SCREEN[1] - 4 <= frame <= CLOSE[0] + 8:
        amount = smooth(SCREEN[1] - 4, SCREEN[1], frame) * (1 - smooth(CLOSE[0], CLOSE[0] + 6, frame))
    elif frame >= CLOSE[1] - 22 and frame <= CLOSE[1]:
        amount = smooth(CLOSE[1] - 22, CLOSE[1], frame)
        strength = 5.0
    if frame >= TURN[0]:
        amount = 0.0

    # Before the rim light arrives the room is fully dark, so nothing here touches the reveal.
    tree = F.veil_mat.node_tree
    mix = next(n for n in tree.nodes if n.type == "MIX_SHADER")
    emit = next(n for n in tree.nodes if n.type == "EMISSION")
    mix.inputs[0].default_value = amount
    emit.inputs["Color"].default_value = (*color, 1)
    emit.inputs["Strength"].default_value = strength
    F.veil.hide_render = amount <= 0.0


# ---- Output

def anchor_points(frame, variant):
    """Where the page should attach callouts and the product screen, as fractions of the frame."""
    scene = F.scene
    bpy.context.view_layer.update()
    result = {}
    if frame <= TEARDOWN[1] and frame >= TEARDOWN[0]:
        for index, stage in enumerate(STAGES):
            board = F.boards[stage]
            point = board.matrix_world.translation + Vector((-1.08, -0.68, 0.02))
            co = world_to_camera_view(scene, F.camera, point)
            result[stage] = [round(co.x, 4), round(1 - co.y, 4)]
    return result


def screen_rect(variant):
    apply_frame(SCREEN_HOLD, variant)
    bpy.context.view_layer.update()
    scene = F.scene
    corners = []
    for y, z in ((-SCREEN_W / 2, SCREEN_H / 2), (SCREEN_W / 2, -SCREEN_H / 2)):
        co = world_to_camera_view(scene, F.camera, Vector((SCREEN_X, y, z)))
        corners.append((co.x, 1 - co.y))
    # The camera looks along +X, so +Y is on the left of the frame.
    left, right = sorted((corners[0][0], corners[1][0]))
    top, bottom = sorted((corners[0][1], corners[1][1]))
    return [round(left, 4), round(top, 4), round(right - left, 4), round(bottom - top, 4)]


def write_anchors(variant, path):
    """Callout positions per teardown frame plus the screen rectangle, for src/film/."""
    per_frame = {}
    setup_variant(variant)
    first = number_of(STAGE_BEATS_START)
    for number in range(first, number_of(TEARDOWN[1]) + 1):
        apply_frame(beat_of(number), variant)
        per_frame[number] = anchor_points(beat_of(number), variant)
    rect = screen_rect(variant)
    data = {}
    if os.path.exists(path):
        with open(path) as handle:
            data = json.load(handle)
    data[variant] = {"stages": {stage: [per_frame[f][stage] for f in sorted(per_frame)] for stage in STAGES}, "firstFrame": first, "screen": rect}
    with open(path, "w") as handle:
        json.dump(data, handle, separators=(",", ":"))


def setup_variant(variant, scale=1.0):
    spec = VARIANTS[variant]
    F.scene.render.resolution_x = round(spec["width"] * scale)
    F.scene.render.resolution_y = round(spec["height"] * scale)
    F.scene.render.resolution_percentage = 100


def film_frames(variant):
    # The turn follows a pointer rather than scroll, so it stays at one image per beat everywhere.
    step = VARIANTS[variant]["step"]
    return list(range(1, number_of(CLOSE[1]) + 1, step)) + list(range(number_of(TURN[0]), number_of(TURN[1]) + 1, 2))


def render(variant, out, frames=None, scale=1.0, samples=None):
    setup_variant(variant, scale)
    if samples:
        F.scene.eevee.taa_render_samples = samples
    os.makedirs(out, exist_ok=True)
    # A full render resumes where it stopped; frames asked for by number are always redone.
    for number in frames or film_frames(variant):
        path = os.path.join(out, f"{number:04d}.png")
        if not frames and os.path.exists(path):
            continue
        apply_frame(beat_of(number), variant)
        F.scene.render.filepath = path
        bpy.ops.render.render(write_still=True, scene=F.scene.name)
        print(f"FRAME {number}", flush=True)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    if not argv:
        return
    command = argv[0]
    options = {argv[i][2:]: argv[i + 1] for i in range(1, len(argv) - 1, 2)}
    variant = options.get("variant", "desktop")
    build()
    if command == "render":
        frames = [int(f) for f in options["frames"].split(",")] if "frames" in options else None
        render(variant, options["out"], frames, float(options.get("scale", 1.0)), int(options["samples"]) if "samples" in options else None)
    elif command == "anchors":
        write_anchors(variant, options["out"])


if __name__ == "__main__":
    main()
