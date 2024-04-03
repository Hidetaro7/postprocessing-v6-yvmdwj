import esbuild from "esbuild";

const main = {
	entryPoints: ["./src/index.js"],
	outdir: "./public/dist",
	logLevel: "info",
	format: "iife",
	target: "es6",
	bundle: true,
	minify: true
};

if(process.argv.includes("-w")) {

	const ctx = await esbuild.context(main);
	await ctx.watch();

} else {

	await esbuild.build(main);

}

