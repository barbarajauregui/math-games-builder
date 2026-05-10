"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

type BuilderChoice =
  | { type: "scenario"; scenario: string }
  | { type: "madlib" }
  | { type: "comic" }
  | { type: "sentence" }
  | { type: "paste" }

interface BuilderPickerProps {
  standardId: string
  onPick: (builderType: "sentence" | "madlib" | "cards" | "comic" | "paste" | "sandpack-template") => void
  onPickScenario: (scenario: string) => void
  onBack: () => void
}

const SCENARIOS = [
  { title: "Bakery", desc: "A baker has pastries on the shelf. More come out of the oven.", scenario: "A baker has some pastries on the shelf. A fresh batch comes out of the oven. Now the baker needs to count how many pastries there are to sell." },
  { title: "Toy Store", desc: "A kid has toys in a basket and picks more off the shelf.", scenario: "A kid already has some toys in their basket. They pick more off the shelf. How many toys are in the basket now?" },
  { title: "Farm", desc: "A farmer collects eggs. The chickens lay more.", scenario: "A farmer already collected some eggs this morning. The chickens laid more. How many eggs does the farmer have now?" },
  { title: "Sports", desc: "A team scores points in the first half, then more in the second.", scenario: "A basketball team scored some points in the first half. They scored more in the second half. How many points did they score in total?" },
  { title: "Party", desc: "Kids are at a party. More friends show up.", scenario: "There are some kids at the birthday party. Then more friends show up. How many kids are at the party now?" },
  { title: "Classroom", desc: "A teacher has pencils. She gets more from the closet.", scenario: "A teacher has some pencils on her desk. She gets more from the supply closet. How many pencils does she have now?" },
]

const GAME_STYLES = [
  { title: "Sum Jumper", desc: "Platformer — your character carries a visible counter; only platforms with the matching number support you.", scenario: "A platformer game where the character carries a glowing crystal floating above their head with a number on it that starts at 0. As they walk past stars on the ground, the crystal ticks up by 1 for each star — you visibly see the number grow with every step. Each platform in the level shows a target number on its surface (e.g., 7). The character can ONLY stand on a platform whose number equals their current crystal count — other platforms fall away or shimmer translucent under their feet. The math IS the navigation: you can see exactly how many stars you need to collect to reach the next platform. Wrong-numbered platforms don't 'lock' — they're physically intangible. To restart your count for the next jump, the character drinks a potion (visibly empties the crystal back to 0). Add smooth jumping physics, glowing star particles when collected, and the count number always visibly tied to gameplay. NEVER hide the count; NEVER use a popup quiz." },
  { title: "Wall Builder", desc: "Tower defense — defenders are physical bricks with visible weight; the wall's load meter fills as you stack.", scenario: "A tower defense game where each gate has a visible LOAD METER showing how much weight it can hold (e.g., a glass tube on the side of the gate that fills as bricks are placed). Each brick is a defender with a visible weight value engraved on its side (1, 2, or 3). The player drags bricks onto the gate to stack a wall. As each brick lands, the load meter visibly rises by the brick's weight number — you watch the tube fill in real time. The gate has a target line on the meter (e.g., 'must reach 8 to hold against the wave'). When the player's stacked weights cross the target line, the wall visibly locks into place and the meter glows. If they overstack or understack, you see exactly why on the meter — no hidden check. The math IS the structure: addition is the meter rising, the answer is whether the meter reaches the target line. Wrong stacks visibly fall short or topple over the line; the player sees the cause. Add brick-clack sounds, meter-fill animation, and dramatic wave-incoming pacing. NEVER use a popup quiz; NEVER hide the running total." },
]

const BUILD_METHODS = [
  { id: "madlib" as const, title: "Fill in the blanks", desc: "Complete a story template with your own characters and things." },
  { id: "comic" as const, title: "Create a comic", desc: "Tell a 3-part story where someone needs to add." },
  { id: "sentence" as const, title: "Write your own", desc: "Describe any real-life addition situation in one sentence." },
]

export function BuilderPicker({ standardId, onPick, onPickScenario, onBack }: BuilderPickerProps) {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "linear-gradient(135deg, #09090b 0%, #0c1222 50%, #09090b 100%)", fontFamily: "'Lexend', system-ui, sans-serif" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 shrink-0">
        <button onClick={onBack} className="text-sm text-zinc-300 hover:text-white">
          <ArrowLeft className="size-4 inline mr-1" />
          Back
        </button>
        <div className="w-12" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Build your game
            </h2>
            <p className="text-sm text-zinc-200">
              Your game needs a real-world situation where someone actually uses addition. Pick one below for inspiration, or create your own.
            </p>
          </div>

          {/* Section 1: Scenario inspiration */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quick start — pick a scenario</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCENARIOS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedScenario(selectedScenario === i ? null : i)}
                  className="text-left rounded-xl p-3 transition-all"
                  style={selectedScenario === i
                    ? { background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.5)", boxShadow: "0 0 12px rgba(59,130,246,0.2)" }
                    : { background: "rgba(24,24,27,0.7)", border: "1px solid rgba(63,63,70,0.4)" }
                  }
                >
                  <p className="text-sm font-semibold text-white">{s.title}</p>
                  <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>
            {selectedScenario !== null && (
              <button
                onClick={() => onPickScenario(SCENARIOS[selectedScenario].scenario)}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-transform active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
              >
                Build game with this scenario
              </button>
            )}
          </div>

          {/* Section 2: Game style */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Or try a game style</p>
            <div className="grid grid-cols-2 gap-2">
              {GAME_STYLES.map((s, i) => (
                <button
                  key={`style-${i}`}
                  onClick={() => onPickScenario(s.scenario)}
                  className="text-left rounded-xl p-3 transition-all hover:border-zinc-500"
                  style={{ background: "rgba(24,24,27,0.7)", border: "1px solid rgba(139,92,246,0.3)" }}
                >
                  <p className="text-sm font-semibold text-purple-300">{s.title}</p>
                  <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-base font-bold text-zinc-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Or create your own</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          {/* Section 2: Build methods */}
          <div className="grid grid-cols-3 gap-2">
            {BUILD_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => onPick(m.id)}
                className="text-left rounded-xl p-3 transition-all hover:border-zinc-500"
                style={{ background: "rgba(24,24,27,0.7)", border: "1px solid rgba(63,63,70,0.4)" }}
              >
                <p className="text-sm font-semibold text-white">{m.title}</p>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{m.desc}</p>
              </button>
            ))}
          </div>

          {/* Bottom options */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onPick("sandpack-template")}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Start from a template
            </button>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => onPick("paste")}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Paste your HTML
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
