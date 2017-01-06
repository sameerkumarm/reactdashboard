var EncodingPlugin = require('webpack-encoding-plugin');
module.exports = {
    entry: 
    { "ReactDashboard" :	"./dashboard/Dashboard.js",
      "DashboardWidget" : "./components/DashboardWidget.js",
      "DashboardChart": "./dashboard/charts/DashboardChart.js"
    },
    plugins: [new EncodingPlugin({
        encoding: 'iso-8859-1'
    })],
    output: {
        path: __dirname + '/build',
        filename: '[name].js',
        //the following 2 params exports the module as global variable
        libraryTarget: "var",
        library: "[name]"
    },
    externals: {
     'react': 'React',
     'react-dom' : 'ReactDOM'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            babelrc: false,
            query:
            {
                presets:['es2015', 'react']
            }
        },
        {test: /\.less$/, loader: "style!css!less"},
        {test: /\.css$/, loader: "style-loader!css-loader" },
        {
			test : /\.png$/,
			loader : "url-loader?limit=100000"
		}, 
		{
			test : /\.jpg$/,
			loader : "file-loader"
		}, 
		{
			test : /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
			loader : 'url?limit=10000&mimetype=application/font-woff'
		}, 
		{
			test : /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
			loader : 'url?limit=10000&mimetype=application/octet-stream'
		}, 
		{
			test : /\.eot(\?v=\d+\.\d+\.\d+)?$/,
			loader : 'file'
		}, 
		{
			test : /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			loader : 'url?limit=10000&mimetype=image/svg+xml'
		}
      ]
    }
};