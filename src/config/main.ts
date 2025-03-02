const secretKey: string = Bun.env.SECRET_KEY ?? '';
const url: string = Bun.env.API_URL ?? '';
const model: string = "llama-3.2-90b-vision-preview";

export { secretKey, url, model };