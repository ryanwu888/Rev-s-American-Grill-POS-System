
module.exports = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.(mp3|wav|m4a)$/,
            use: {
                loader: "file-loader",
                options: {
                    publicPath: "/_next/static/audio/",
                    outputPath: "static/audio/",
                    name: "[name].[ext]",
                },
            },
        });
        return config;
    },
    env: {
        URL: "https://revs-backend2.onrender.com"
        // URL: "http://localhost:8081"
    }
};