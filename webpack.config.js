const path = require('path');
var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyPlugin = require('copy-webpack-plugin');

let defaults = 



module.exports = 
[
	{
		mode: "development",
		devtool: "inline-source-map",
		entry: './pancake/pancake_main.tsx',

		output:
		{
			path: path.resolve( __dirname, 'dist/pancake' ),
			filename: "pancake_bundle.js"
		},
		module: 
		{
			rules:
			[
				{ 
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					use: 
					[
						'style-loader',
						'css-loader'
					]
				},
				{
					test: /\.(png|svg|jpg|gif)$/,
					use: 
					[
						'file-loader'
					]
				}
					
			]
		},
	
		resolve:
		{
			modules:[ path.resolve( __dirname, 'node_modules' ) ],
			extensions: [ '.ts', '.tsx', '.js' ],
			alias: 
			{
				"common" : path.resolve( __dirname, "./common" )
			}
		},
		plugins:
		[
			new HtmlWebpackPlugin(
				{
					hash: true,
					filename: "./index.html",
					template: "./pancake/index.html",
				}
			),
			new CopyPlugin(
				[
					{ from: './pancake/pancake_styles.css', to: 'pancake_styles.css' },
					{ from: './registry.json', to: 'registry.json' },
				]
				),
		]
		
	},
	{
		target: "node",
		entry: 
		{
			app: ["./server/server.ts" ]
		},
		output:
		{
			path: path.resolve( __dirname, 'dist/server' ),
			filename: "server_bundle.js"
		},
		resolve:
		{
			extensions: ['.ts', '.js' ]
		},
		module: 
		{
			rules:
			[
				{ 
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				},
			]
		},
		node:
		{
			__dirname: false,
			__filename: false,
		},

		// Workaround for ws module trying to require devDependencies
		externals: 
		[ 
			// {
			// 	'express': {commonjs: 'express'}
			// },
			'utf-8-validate', 
			'bufferutil' 
		],

		mode: "development",
		devtool: "inline-source-map",

		plugins:
		[
			new CopyPlugin(
				[
					{ from: './node_modules/node/bin/node.exe', to: 'bin/node.exe' },
				]
				),
	
			],

		resolve:
		{
			modules:[ path.resolve( __dirname, 'node_modules' ) ],
			extensions: [ '.ts', '.tsx', '.js' ],
			alias: 
			{
				"common" : path.resolve( __dirname, "./common" ),
				"@aardvarkxr/aardvark-shared" : path.resolve( __dirname, "../packages/aardvark-shared/src/index.ts" ),
				"@aardvarkxr/aardvark-react" : path.resolve( __dirname, "../packages/aardvark-react/src/index.ts" )
			}
		},	
	}
];
