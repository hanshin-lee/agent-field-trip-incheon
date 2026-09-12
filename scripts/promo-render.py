#!/usr/bin/env python3
"""Deterministic local-only promo renderer. Requires Pillow, ffmpeg, local Korean font.
Run: python3 scripts/promo-render.py [--preview]
No network, stock assets, generated app states, audio, or redistributed fonts.
"""
from pathlib import Path
import argparse, hashlib, json, math, subprocess, time
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'evidence/recordings'
SHOTS = ROOT / 'evidence/screenshots'
FONT = '/System/Library/Fonts/AppleSDGothicNeo.ttc'
FFMPEG = '/opt/homebrew/bin/ffmpeg'
W, H, FPS, SECONDS = 1280, 720, 30, 40
CREAM = '#F7F4EB'; INK = '#172321'; MUTED = '#6C726A'
BLUE = '#2257EF'; ORANGE = '#F16A35'; LINE = '#DADCD2'
SOURCES = ['07-cream-editorial.png', '08-recipe-kimchijjigae.png']
IMAGES = [Image.open(SHOTS / p).convert('RGB') for p in SOURCES]
FONTS = {}

def font(size, bold=False):
    key = size, bold
    if key not in FONTS:
        FONTS[key] = ImageFont.truetype(FONT, size, index=6 if bold else 0)
    return FONTS[key]

def text(d, xy, s, size=28, color=INK, bold=False):
    d.text(xy, s, font=font(size, bold), fill=color, stroke_width=0)

def pill(d, x, y, label, color=BLUE, size=21):
    width = d.textbbox((0,0), label, font=font(size, True))[2] + 32
    d.rounded_rectangle((x,y,x+width,y+39), radius=19, fill=color)
    text(d, (x+16,y+7), label,size,'#FFFFFF',True)
    return width

def line(d, x, y, value, label, color):
    text(d,(x,y),value,69,color,True)
    text(d,(x,y+83),label,22,MUTED)

# All excerpts are crops of actual captured UI. Never synthesize UI interactions.
SCENES = [
    dict(start=0,end=6,source=0,crop=(0,50,860,1590),box=(828,78,366,534)),
    dict(start=6,end=12,source=1,crop=(20,20,840,757),box=(778,114,427,427)),
    dict(start=12,end=20,source=0,crop=(40,748,819,1490),box=(666,113,542,493)),
    dict(start=20,end=27,source=1,crop=(40,2020,820,3115),box=(806,76,393,543)),
    dict(start=27,end=34,source=1,crop=(39,3135,823,3696),box=(637,158,570,417)),
    dict(start=34,end=40,source=None),
]

def base_scene(i):
    im = Image.new('RGB',(W,H),CREAM); d=ImageDraw.Draw(im)
    # restrained editorial grid and recurring brand elements
    d.rectangle((0,0,W,8),fill=BLUE)
    text(d,(64,35),'SINPO / 신포시장 한 끼',20,INK,True)
    text(d,(1080,35),f'{i+1:02d} / 06',20,MUTED)
    d.line((64,73,1216,73),fill=LINE,width=1)
    if i == 0:
        pill(d,64,119,'인천 중구 · 신포국제시장',BLUE)
        text(d,(60,193),'오늘 뭐 먹지?',76,INK,True)
        text(d,(62,288),'신포시장에서',59,INK,True)
        text(d,(62,361),'답을 찾다.',59,BLUE,True)
        text(d,(66,474),'먹고 싶은 메뉴에서 시작하는',29,MUTED)
        text(d,(66,518),'시장 한 끼, 그리고 장보기.',29,INK)
        d.ellipse((702,536,742,576),fill=ORANGE)
    elif i == 1:
        pill(d,64,112,'01  메뉴부터 고르세요')
        text(d,(62,181),'취향은 다양하게.',55,INK,True)
        text(d,(62,248),'선택은 간단하게.',55,BLUE,True)
        line(d,67,362,'4','카테고리',INK)
        line(d,282,362,'16','메뉴',BLUE)
        line(d,503,362,'18','큐레이션 가게',ORANGE)
        text(d,(66,535),'시장 명물  /  분식  /  집밥·국물  /  해물·안주',23,MUTED)
    elif i == 2:
        pill(d,64,112,'02  메뉴와 가게를 연결해요')
        text(d,(62,190),'사 먹을까,',62,BLUE,True)
        text(d,(62,266),'만들어 먹을까?',55,ORANGE,True)
        d.ellipse((68,377,86,395),fill=BLUE)
        text(d,(103,366),'메뉴를 파는 집',30,INK,True)
        d.ellipse((68,427,86,445),fill=ORANGE)
        text(d,(103,416),'필요한 재료 가게',30,INK,True)
        text(d,(66,499),'쫄면을 고르면, 연결된 가게를 한눈에.',25,MUTED)
        text(d,(66,550),'위치는 도식 좌표를 위경도로 환산한 근사치',20,MUTED)
        text(d,(66,579),'검증된 GPS · 실시간 재고 · 내비게이션 아님',20,MUTED)
    elif i == 3:
        pill(d,64,112,'03  장보기는 필요한 만큼',ORANGE)
        text(d,(62,185),'오늘의 집밥,',57,INK,True)
        text(d,(62,256),'김치찌개.',70,ORANGE,True)
        text(d,(67,358),'3인분  ·  약 40분  ·  난이도 쉬움',25,MUTED)
        d.line((67,414,696,414),fill=LINE,width=2)
        text(d,(67,440),'묵은지 ½포기 · 돼지목살 300g',30,INK,True)
        text(d,(67,490),'두부 1모, 그리고 연결된 재료 가게.',28,INK)
        text(d,(67,555),'재료의 양과 가게를 함께 확인하세요.',25,MUTED)
    elif i == 4:
        pill(d,64,112,'04  만드는 순서까지')
        text(d,(62,192),'장보기 다음은',52,INK,True)
        text(d,(62,259),'따뜻한 한 끼.',55,BLUE,True)
        text(d,(66,374),'재료의 양부터 조리 단계까지,',27,INK)
        text(d,(66,419),'레시피를 따라 차근차근.',27,INK)
        text(d,(66,512),'김치찌개 · 실제 서비스 레시피 화면',22,MUTED)
    else:
        pill(d,64,116,'메뉴 → 가게 → 재료 → 레시피',BLUE)
        text(d,(61,202),'오늘의 한 끼로,',77,INK,True)
        text(d,(61,299),'시장을 새롭게 만나다.',77,INK,True)
        text(d,(67,440),'신포시장 한 끼',36,BLUE,True)
        text(d,(67,498),'먹고 싶은 메뉴를 골라보세요.',30,MUTED)
        # abstract local graphic, not geographic navigation
        for x,y,c in [(1007,463,BLUE),(1153,539,ORANGE),(1070,574,INK)]:
            d.ellipse((x-19,y-19,x+19,y+19),fill=c)
        text(d,(67,576),'AGENT FIELD TRIP 2026  /  DONG INCHEON',19,MUTED)
    return im

BASES = [base_scene(i) for i in range(6)]
CROPS = [IMAGES[s['source']].crop(s['crop']) if s['source'] is not None else None for s in SCENES]
MASKS = {}
for s in SCENES:
    if 'box' in s:
        x,y,w,h=s['box']; m=Image.new('L',(w,h)); ImageDraw.Draw(m).rounded_rectangle((0,0,w-1,h-1),radius=22,fill=255); MASKS[(w,h)]=m

def smooth(p):
    return p*p*(3-2*p)

def scene_frame(i, p):
    im=BASES[i].copy(); d=ImageDraw.Draw(im); s=SCENES[i]
    if s['source'] is not None:
        x,y,w,h=s['box']
        d.rounded_rectangle((x-9,y-9,x+w+9,y+h+9),radius=29,fill='#E3E3D9')
        # Subtle real screenshot crop pan + 2.5% zoom; no invented clicks.
        crop=CROPS[i]; cw,ch=crop.size
        z=1+0.025*smooth(p); bw=cw/z; bh=ch/z
        ox=(cw-bw)*(0.3+0.4*p); oy=(ch-bh)*p
        moving=crop.resize((w,h),Image.Resampling.BICUBIC,box=(ox,oy,ox+bw,oy+bh))
        im.paste(moving,(x,y),MASKS[(w,h)])
    return im

def frame(t):
    i=next((j for j,s in enumerate(SCENES) if t<s['end']),5)
    s=SCENES[i]; p=(t-s['start'])/(s['end']-s['start'])
    im=scene_frame(i,p)
    # 0.45 s editorial dissolves. Attribution/disclaimer remain fully opaque.
    remaining=s['end']-t
    if i<5 and remaining<0.45:
        im=Image.blend(im,scene_frame(i+1,0),smooth(1-remaining/0.45))
    d=ImageDraw.Draw(im)
    d.rectangle((0,630,W,H),fill=CREAM)
    d.line((64,630,1216,630),fill=LINE,width=1)
    text(d,(64,639),'지도 © OpenStreetMap contributors · openstreetmap.org/copyright',21,MUTED)
    text(d,(64,676),'프로토타입 · 가게 위치·판매 품목 현장 확인 필요',22,INK,True)
    # Thin elapsed-time rule, no UI/navigation implication.
    d.rectangle((0,715,int(W*t/SECONDS),719),fill=BLUE)
    return im

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--preview',action='store_true');args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    samples=[2.8,8.8,15.8,23.5,30.3,37.5]
    sheet=Image.new('RGB',(1280,1080),'#DDD9CD')
    for n,t in enumerate(samples):
        im=frame(t)
        im.save(SHOTS/f'promo-scene-{n+1:02d}.png')
        sheet.paste(im.resize((640,360),Image.Resampling.LANCZOS),((n%2)*640,(n//2)*360))
    sheet.save(SHOTS/'promo-storyboard.jpg',quality=94)
    if args.preview:
        print('Preview:',SHOTS/'promo-storyboard.jpg',flush=True);return
    output=OUT/'sinpo-market-promo.mp4'
    command=[FFMPEG,'-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-frames:v',str(FPS*SECONDS),str(output)]
    print('Rendering',output,flush=True);start=time.monotonic()
    proc=subprocess.Popen(command,stdin=subprocess.PIPE)
    try:
        for n in range(FPS*SECONDS):
            proc.stdin.write(frame(n/FPS).tobytes())
            if n%150==0:print(f'{n}/{FPS*SECONDS} frames | {time.monotonic()-start:.1f}s',flush=True)
        proc.stdin.close()
        code=proc.wait()
        if code:raise RuntimeError(f'ffmpeg exited {code}')
    except BaseException:
        proc.kill();proc.wait();raise
    manifest={'output':str(output.relative_to(ROOT)),'duration_seconds':SECONDS,'fps':FPS,'resolution':[W,H],'audio':False,'source_assets':{n:hashlib.sha256((SHOTS/n).read_bytes()).hexdigest() for n in SOURCES},'font':FONT,'font_redistributed':False,'output_sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'command':command,'elapsed_seconds':round(time.monotonic()-start,2)}
    (OUT/'promo-render-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(manifest,ensure_ascii=False,indent=2),flush=True)

if __name__=='__main__':main()
