import * as express from 'express';
import * as http from 'http';
import * as path from 'path';



class CServer
{
	private m_app = express();
	private m_server = http.createServer( this.m_app );

	constructor( port: number )
	{
		this.m_server.listen( port, () => 
		{
			console.log(`Server started on port ${ port } :)`);
		} );

		// this.m_app.use( "/gadgets", express.static( path.resolve( g_localInstallPath, "gadgets" ) ) );
		// this.m_app.use( "/models", express.static( path.resolve( g_localInstallPath, "models" ) ) );
	}

	async init()
	{
	}

}

// the VS Code debugger and the source maps get confused if the CWD is not the workspace dir.
// Instead, just chdir to the data directory if we start in the workspace dir.
let p = process.cwd();
if( path.basename( p ) != "dist" )
{
	process.chdir( "dist" );
}

let server:CServer;

async function startup()
{
	server = new CServer( 1234 );
	server.init();
}

startup();

