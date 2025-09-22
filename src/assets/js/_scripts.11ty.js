// This file handles the JS build.
// It will run webpack with babel over all JS defined in the main entry file.

// main entry point name
const ENTRY_FILE_NAME = 'main.js'


import path from "path";
import { fileURLToPath } from 'url';
import webpack from "webpack";
import fs from "fs";
const isProd = process.env.ELEVENTY_RUN_MODE === 'build';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class {
    // Configure Webpack in Here
    async data() {
        const entryPath = path.join(__dirname, `/${ENTRY_FILE_NAME}`)
        const outputPath = path.resolve(__dirname, '../../../.temp-js/')
        
        // Transform .js files, run through Babel
        const rules = [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]

        // pass environment down to scripts
        const envPlugin = new webpack.EnvironmentPlugin({
            ELEVENTY_RUN_MODE: process.env.ELEVENTY_RUN_MODE
        })

        // Main Config
        const webpackConfig = {
            mode: isProd ? 'production' : 'development',
            entry: entryPath,
            output: { path: outputPath },
            module: { rules },
            plugins: [envPlugin]
        }

        return {
            permalink: `/assets/js/${ENTRY_FILE_NAME}`,
            eleventyExcludeFromCollections: true,
            webpackConfig
        }
    }

    // Compile JS with Webpack
    compile(webpackConfig) {
        const compiler = webpack(webpackConfig)

        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err || stats.hasErrors()) {
                    const errors =
                        err ||
                        (stats.compilation ? stats.compilation.errors : null)

                    reject(errors)
                    return
                }

                console.log(webpackConfig.output.path)
                fs.readFile(
                    webpackConfig.output.path + '\\' + ENTRY_FILE_NAME,
                    'utf8',
                    (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    }
                )
            })
        })
    }

    // render the JS file
    async render({ webpackConfig }) {
        try {
            const result = await this.compile(webpackConfig)
            return result
        } catch (err) {
            console.log(err)
            return null
        }
    }
}