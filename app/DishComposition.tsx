"use client";

import { useState, type CSSProperties } from "react";
import type { Menu } from "@/lib/market";

// Decorative cues only; ingredient names and quantities always come from the recipe.
function ingredientIcon(name: string) {
  if (/계란|달걀/.test(name)) return "🥚";
  if (/닭/.test(name)) return "🍗";
  if (/돼지|소고기|목살|차돌/.test(name)) return "🥩";
  if (/새우/.test(name)) return "🦐";
  if (/오징어/.test(name)) return "🦑";
  if (/고등어|갈치|멸치|황태/.test(name)) return "🐟";
  if (/조개|홍합|골뱅이/.test(name)) return "🐚";
  if (/국수|면|당면/.test(name)) return "🍜";
  if (/떡/.test(name)) return "🍥";
  if (/밥|쌀/.test(name)) return "🍚";
  if (/김치|묵은지|고추/.test(name)) return "🌶️";
  if (/당근/.test(name)) return "🥕";
  if (/마늘/.test(name)) return "🧄";
  if (/양파/.test(name)) return "🧅";
  if (/감자/.test(name)) return "🥔";
  if (/파|부추|채|오이|미역|김\(|다시마|호박|콩나물/.test(name)) return "🥬";
  if (/견과|씨앗/.test(name)) return "🥜";
  if (/^물(?:$|\()/.test(name)) return "💧";
  return "🥣";
}

export default function DishComposition({ menu }: { menu: Menu }) {
  const [replay, setReplay] = useState(0);
  return (
    <section className="dish-composition mt-6" aria-labelledby="dish-composition-title" data-menu-id={menu.id}>
      <div className="dish-heading">
        <div>
          <p className="dish-eyebrow">시장에서 한 그릇</p>
          <h2 id="dish-composition-title" className="display-whisper">{menu.name} 안에는</h2>
        </div>
        <button type="button" className="dish-replay" onClick={() => setReplay((n) => n + 1)} aria-label={`${menu.name} 재료 다시 담기`}>
          <span aria-hidden="true">↻</span> 다시 담기
        </button>
      </div>
      <p className="dish-subtitle">{menu.recipe.servings}인분에 들어가는 재료, 한눈에 살펴보세요.</p>
      <p className="sr-only" role="status">{menu.name}, 재료 {menu.ingredients.length}가지, {menu.recipe.servings}인분</p>
      <div className="dish-vessel">
        <div className="dish-serving" aria-hidden="true">
          <span>{menu.emoji}</span>
          <span className="dish-serving-caption">오늘의 한 접시</span>
        </div>
        {/* A keyed subtree cancels the old CSS animation immediately on replay.
            The parent also keys this component by menu.id: no timers or stale ingredients. */}
        <ul className="dish-ingredients" key={`${menu.id}-${replay}`} aria-label={`${menu.name} 재료와 분량`}>
          {menu.ingredients.map((ingredient, index) => (
            <li className="dish-ingredient" key={ingredient.name} style={{
              "--ingredient-delay": `${index * 35}ms`,
              "--ingredient-from-x": index % 2 === 0 ? "-32px" : "32px",
              "--ingredient-tilt": index % 2 === 0 ? "-7deg" : "7deg",
            } as CSSProperties}>
              <span className="dish-ingredient-icon" aria-hidden="true">{ingredientIcon(ingredient.name)}</span>
              <div className="dish-ingredient-copy">
                <span className="dish-ingredient-name">{ingredient.name}</span>
                <span className="dish-ingredient-amount">{ingredient.amount}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="dish-vessel-foot" aria-hidden="true">손끝에서 시작되는, 오늘의 한 끼</div>
      </div>
      <p className="dish-note">재료 구성 일러스트 · 실제 조리 모습과 다를 수 있어요.<br />아래 지도에서 등록된 재료 가게와 만드는 법을 이어서 확인하세요.</p>
    </section>
  );
}
