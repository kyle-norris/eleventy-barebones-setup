import handlebarsPlugin from "@11ty/eleventy-plugin-handlebars";
import { open } from "out-url";

export default function(eleventyConfig) {

    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("dist");
    eleventyConfig.addPlugin(handlebarsPlugin);
    eleventyConfig.setBrowserSyncConfig({
        open: true
    })
    eleventyConfig.addWatchTarget('./src/assets')

    var port = 8000;
    eleventyConfig.setServerOptions({
        port: port,
        ready: function(server) {
            open(`http://localhost:${port}`)
        }
    })

    return {
        templateFormats: ['html', 'hbs', '11ty.js']
    }
}