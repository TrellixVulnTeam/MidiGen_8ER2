#!/usr/bin/env python
import argparse
parser = argparse.ArgumentParser(description='Enter file name')
parser.add_argument('-f')
args = parser.parse_args()
file_tr = 'file.txt'
if args.f != None:
    file_tr = args.f

print("A prerequisite to run this code is the python library 'midiutil'")
print("If not already done, run 'pip install midiutil'")

def nextpass(a, b, k):
    ftr = open(file_tr, "r")
    data = ftr.read().split()
    ftr.close()

    k_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    k_OCTAVES = list(range(11))
    k_NOTES_IN_OCTAVE = len(k_NOTES)

    note = k_NOTES.index(a)
    note += (k_NOTES_IN_OCTAVE * int(b))

    diff = note-48


    from midiutil import MIDIFile

    c = str(data[0])
    data.pop(0)

    scales = {
            'major' : {"m":41, "p":43, "d":45, "n":47, "S":48, "R":50, "G":52, "M":53, "P":55, "D":57, "N":59, "S^":60, "R^":62, "G^":64, "M^":65, "P^":67},
            'mayamalavagoaluoi' : {"m":41, "p":43, "d":45, "n":46, "S":48, "R":49, "G":52, "M":53, "P":55, "D":56, "N":59, "S^":60, "R^":61, "G^":64, "M^":65, "P^":67},
            'mohanam' : {"p":43, "d":45, "S":48, "R":50, "G":52, "P":55, "D":57, "S^":60, "R^":62, "G^":64, "P^":67}
        }

    for note in scales[c]:
        scales[c][note] += diff

    track    = 0
    channel  = 0
    time     = 0
    duration = 1
    tempo    = int(data[0])
    volume   = 100

    MIDIs = MIDIFile(1)
    MIDIs.addTempo(track,time, tempo)
    if k == "violin":
        MIDIs.addProgramChange(0, 0, 0, 41)
    else:
        pass

    prevnote = 1
    for val in range(len(data)):
        if str(data[val]).isnumeric():
            tempo = int(data[val])
            MIDIs.addTempo(track,time, tempo)
        else:
            try:
                if data[val] != "_":
                    temp_duration = duration
                    if data[val+1] == '_':
                        iter = val+1
                        while data[iter] == '_':
                            iter += 1
                            temp_duration += 1
                    prevnote = scales[c][data[val]]
                    MIDIs.addNote(track, channel, prevnote, time, temp_duration, volume)
                    time += temp_duration
            except:
                print("Note Error : '" + data[val] + "'")



    with open("output.mid", "wb") as opf:
        MIDIs.writeFile(opf)
    print("--------")
    print("DONE ==> check output.mid")


def getInput():
    k = input("Enter Scale Root: ")
    k = str(k).upper()
    r = input("Enter Octave: ")
    types = input("Choose instrument (violin, or piano): ").lower()
    print("--------")
    if str(k).upper() in ["C", "D", "E", "F", "G", "A", "B"] and r.isnumeric():
        nextpass(k, r, types)
    else:
        print("Invalid!")
        print("--------")
        getInput()

print("--------")
getInput()

print("--------")