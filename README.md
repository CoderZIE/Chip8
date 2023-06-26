# Chip8
Chip8 Emulator in JavaScript
This is a Chip8 emulator implemented in JavaScript. The Chip8 is a simple virtual machine developed in the 1970s and primarily used to create video games. This emulator allows you to run Chip8 ROMs and experience the games on modern systems.

Getting Started
To use the emulator, follow these steps:

Clone or download the repository to your local machine.
Open the index.html file in your web browser.
You should see the emulator interface and it will start with airplane game.

To add different games I have attached the chip8_roms folder. choose a file and add in roms folder.

Now change the rom name in chip8.js to the rom you want. 
<img width="194" alt="image" src="https://github.com/CoderZIE/Chip8/assets/102377644/6f223711-0aed-4432-aca8-fd7a80027694">


The emulator will load the ROM and start running it.
Keyboard Mapping
The Chip8 system uses a 16-key hexadecimal keypad. The emulator maps these keys to your computer keyboard as follows:


CHIP8 KEYPAD       KEYBOARD
+-+-+-+-+         +-+-+-+-+
|1|2|3|C|         |1|2|3|4|
+-+-+-+-+   ==>   +-+-+-+-+
|4|5|6|D|   ==>   |Q|W|E|R|
+-+-+-+-+   ==>   +-+-+-+-+
|7|8|9|E|         |A|S|D|F|
+-+-+-+-+         +-+-+-+-+
|A|0|B|F|         |Z|X|C|V|
+-+-+-+-+         +-+-+-+-+
Controls
The emulator provides the following controls:

Spacebar: Start/Pause the emulation.
R: Reset the emulator (resets the CPU and clears the display).
C: Clear the display.
P: Increase the emulation speed.
O: Decrease the emulation speed.
Features
The emulator implements all the standard Chip8 instructions, including arithmetic, logical, and control flow operations.
The display is rendered using HTML5 Canvas.
The emulator provides sound emulation using the Web Audio API.
The execution speed can be adjusted to match the original Chip8 clock speed.
The emulator supports most Chip8 ROMs available online.
Compatibility
This emulator has been tested on modern web browsers, including Chrome, Firefox, and Safari. It should work on most platforms, including Windows, macOS, and Linux.

Resources
If you want to learn more about the Chip8 system or find additional ROMs to run on the emulator, here are some useful resources:

Wikipedia - Chip-8
CHIP-8 Archive

Acknowledgements
This emulator is based on the work of freecode camp: https://www.freecodecamp.org/news/creating-your-very-own-chip-8-emulator/

Cowgod's Chip-8 Technical Reference
The CHIP-8 Cookbook
Chip8 Emulator in JavaScript by Colin Eberhardt






