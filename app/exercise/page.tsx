"use client";

import { useEffect, useState } from "react";

export default function ExercisePlayer() {
    const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(
        null
    );
    const [lastNote, setLastNote] = useState("");
    const [velocity, setVelocity] = useState(0);

    useEffect(() => {
        if (typeof navigator !== "undefined" && navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then((access) => {
                setMidiAccess(access);
                const input = Array.from(access.inputs.values())[0];
                if (input) {
                    input.onmidimessage = handleMIDIMessage;
                }
            });
        } else {
            alert("Web MIDI is not supported in this browser.");
        }

        return () => {
            midiAccess?.inputs.forEach((input) => {
                input.onmidimessage = null;
            });
        };
    }, []);

    const handleMIDIMessage = (message: WebMidi.MIDIMessageEvent) => {
        const [command, note, velocity] = message.data;

        // 144 = note on, 128 = note off
        if (command === 144 && velocity > 0) {
            const noteName = midiNoteToNoteName(note);
            setLastNote(noteName);
            setVelocity(velocity);
        }
    };

    const midiNoteToNoteName = (note: number) => {
        const notes = [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B",
        ];
        const octave = Math.floor(note / 12) - 1;
        return notes[note % 12] + octave;
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-6">🎹 Exercise Player</h1>
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                <p className="text-2xl">
                    Last Note Played:{" "}
                    <span className="text-green-400">{lastNote}</span>
                </p>
                <p className="text-xl mt-2">
                    Velocity: <span className="text-blue-400">{velocity}</span>
                </p>
            </div>
        </main>
    );
}
