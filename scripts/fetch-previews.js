import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const certsFile = path.join(rootDir, "src/content/certificates.json");
const outputJson = path.join(rootDir, "src/content/certificate_previews.json");
const imageDir = path.join(rootDir, "public/assets/previews");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const logInfo = (message) => process.stdout.write(`${message}\n`);
const logError = (message) => process.stderr.write(`${message}\n`);

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https") ? https : http;
        client
            .get(url, (res) => {
                const chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", async () => {
                    if (res.statusCode === 200) {
                        try {
                           await fs.writeFile(filepath, Buffer.concat(chunks));
                           resolve(filepath);
                        } catch (e) {
                           reject(e);
                        }
                    } else if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
                        downloadImage(res.headers.location, filepath)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject(
                            new Error(
                                `Request Failed With a Status Code: ${res.statusCode} at ${url}`
                            )
                        );
                    }
                });
            })
            .on("error", reject);
    });
};

async function main() {
    logInfo("Reading certificates...");
    let certsData;
    try {
        const fileContent = await fs.readFile(certsFile, "utf-8");
        certsData = JSON.parse(fileContent);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown read error";
        logError(`Failed to read certificates.json: ${message}`);
        process.exit(1);
    }

    const previews = {};
    await fs.mkdir(imageDir, { recursive: true });

    for (const cert of certsData) {
        if (!cert.credentialUrl || cert.credentialUrl.trim() === "") continue;

        logInfo(
            `Generating offline preview data for ${cert.title} (${cert.id})...`,
        );

        previews[cert.id] = {
            title: `${cert.title} - ${cert.issuer} Certificate`,
            description: cert.description || `View my ${cert.title} certification on ${cert.issuer}.`,
            image: `https://placehold.co/600x400/9f00ff/ffffff/png?text=${encodeURIComponent(cert.title)}`,
        };

        const imageName = `${cert.id}.png`;
        const localImagePath = path.join(imageDir, imageName);

        try {
            logInfo(`Downloading dummy image for ${cert.id}...`);
            await downloadImage(previews[cert.id].image, localImagePath);
            previews[cert.id].image = `/assets/previews/${imageName}`;
        } catch (imgError) {
            const message =
                imgError instanceof Error
                    ? imgError.message
                    : "Unknown download error";
            logError(
                `Failed to download placehold.co for ${cert.id}: ${message}`,
            );
        }

        await wait(200);
    }

    logInfo(`Saving ${Object.keys(previews).length} previews...`);
    await fs.writeFile(outputJson, JSON.stringify(previews, null, 2));

    logInfo(
        `Done! Fetched ${Object.keys(previews).length} previews using placeholder fallback.`,
    );
}

main().catch((error) => {
    const message =
        error instanceof Error
            ? error.stack ?? error.message
            : "Unknown script failure";
    logError(message);
    process.exitCode = 1;
});
