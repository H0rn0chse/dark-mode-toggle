import { startServer } from "@h0rn0chse/socket-server";

startServer({
    publicPaths: [[
        "/demo", "/"
    ], [
        "/dist", "/libs/dark-mode-toggle"
    ], [
        "/node_modules/lottie-web/build/", "/libs/lottie-web"
    ], [
        "/node_modules/wc-github-corners/dist", "/libs/wc-github-corners"
    ]]
});
