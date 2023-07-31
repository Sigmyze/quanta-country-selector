const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
    webpack: function(config, env) {
        const inlineChunkHtmlPlugin = config.plugins.find(
            element => element.constructor.name === "InlineChunkHtmlPlugin"
        )

        if(inlineChunkHtmlPlugin) {
            config.plugins.splice(config.plugins.indexOf(inlineChunkHtmlPlugin), 0,
                new HtmlInlineCssWebpackPlugin(),
                new HtmlInlineScriptPlugin()
            )
        }

        const htmlWebpackPlugin = config.plugins.find(element => element.constructor.name === "HtmlWebpackPlugin")
        config.plugins.splice(config.plugins.indexOf(htmlWebpackPlugin), 1,
            new HtmlWebpackPlugin(
                {
                    ...htmlWebpackPlugin.userOptions,
                    inject: 'body'
                }
            )
        )

        return config;
    }
}