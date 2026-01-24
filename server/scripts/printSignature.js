
const clear = () => process.stdout.write('\x1b[2J\x1b[0f');

const nameArt = [
    "  ____        _                         ____                  _            ",
    " / ___|  __ _| |_ _   _  __ _ _ __ ___ |  _ \\  __ _ _ __   __| | ___ _   _ ",
    " \\___ \\ / _` | __| | | |/ _` | '_ ` _ \\| |_) |/ _` | '_ \\ / _` |/ _ \\ | | |",
    "  ___) | (_| | |_| |_| | (_| | | | | | |  __/| (_| | | | | (_| |  __/ |_| |",
    " |____/ \\__,_|\\__|\\__, |\\__,_|_| |_| |_|_|    \\__,_|_| |_|\\__,_|\\___|\\__, |",
    "                  |___/                                              |___/ "
];

const title = "BACKEND DEVELOPER";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const typeWriter = async (text, speed = 5, color = '\x1b[36m') => { // Cyan default
    process.stdout.write(color);
    for (let char of text) {
        process.stdout.write(char);
        await sleep(speed);
    }
    process.stdout.write('\x1b[0m'); // Reset
};

const typeWriterBlock = async (lines, speed = 2, color = '\x1b[36m') => {
    process.stdout.write(color);
    for (let line of lines) {
        for (let char of line) {
            process.stdout.write(char);
            await sleep(speed);
        }
        process.stdout.write('\n');
    }
    process.stdout.write('\x1b[0m');
};

const run = async () => {
    clear();
    console.log('\n');

    // Animate Name (Blue/Cyan)
    await typeWriterBlock(nameArt, 2, '\x1b[1m\x1b[36m');

    console.log('\n');

    // Center the title roughly based on art width (approx 75 chars)
    const padding = " ".repeat(25);

    // Animate Title (Yellow/Gold)
    process.stdout.write(padding);
    await typeWriter(title, 50, '\x1b[1m\x1b[33m');

    console.log('\n\n');
};

run();
