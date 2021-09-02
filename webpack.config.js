/// <binding ProjectOpened='Watch - Development' />
var path = require('path');
var webpack = require('webpack');

module.exports = {
    mode: 'development',
    context: __dirname, //The base directory, an absolute path, for resolving entry points and loaders from configuration.
    entry: {

        app: "./src/app.ts"
    },
    output: {
        path: path.join(__dirname + '/dist'),
        filename: '[name].bundle.js'
    },
    devtool: 'source-map', // many options here which impact package time 'source-map' was used previously.
    resolve: {
        extensions: ['.ts', '.js'],
        // alias: { // doesnt seem to be needed anymore
        //     'angular': path.resolve(path.join(__dirname, 'node_modules', 'angular')),
        // }
    },
    stats: {
        // suppress "export not found" warnings about re-exported types. ForkTsCheckerWebpackPlugin recommended config.
        warningsFilter: /export .* was not found in/
    },
    module: {
        rules: [
            //{ test: /\.ts$/, loader: 'tslint-loader', enforce: 'pre', options: { emitErrors: false, failOnHint: false } },
            {
                test: /\.ts$/,
                use: [
                    {
                      loader: 'thread-loader',
                      options: {
                        // There should be 1 cpu for the fork-ts-checker-webpack-plugin
                        //workers: 2,
                        // Keeps workers alive for dev rebuilding (starting a worker takes some time)
                        poolTimeout: 2000, // 2000 production
                      },
                    },
                    {
                      loader: 'ts-loader',
                      options: {
                        happyPackMode: true,
                        // configFile: root('tsconfig.project.json'),
                      },
                    },
                  ],
                // options: {
                //     transpileOnly: true // option when only using ts-loader rather than happypack
                // }
            },
            {
                test: /\.html/, 
                loader: 'file-loader?name=[name].[ext]', 
            },
        ]
        // postLoaders: [{ test: /\.ts$/, loader: 'tslint' }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "$": "jquery"
        })
    ],
    optimization: {
        splitChunks: { //CommonChunksPlugin replacement
            name: 'vendor',
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks:'initial'
                },
            },
            //noEmitOnErrors: true,
        }
    }
}