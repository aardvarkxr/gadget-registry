import { observer } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios, { AxiosResponse } from 'axios';
import {AardvarkManifest} from '@aardvarkxr/aardvark-shared';
import { json } from 'express';
import isUrl from 'is-url';

interface GadgetRegistryEntry
{
	url: string;
	manifest?: AardvarkManifest
}

interface GadgetRegistry
{
	minimumAardvarkVersion: string;
	gadgets: GadgetRegistryEntry[];
}

interface GadgetRegistryPancakeState
{
	error?: string;
	registry?: GadgetRegistry;
	gadgets?: GadgetRegistryEntry[];
	failedUrls?: string[];
}

declare global 
{
	namespace JSX 
	{
		interface IntrinsicElements 
		{
			'model-viewer': ModelViewerAttributes;
		}

		interface ModelViewerAttributes 
		{
			'src': string;
			'auto-rotate': boolean;
		}
	}
}

class GadgetRegistryPancake extends React.Component< {}, GadgetRegistryPancakeState >
{

	constructor( props: any )
	{
		super( props );

		this.state = { };

		axios.get( "registry.json" )
		.then( async ( response: AxiosResponse ) =>
		{
			if( response.status != 200 )
			{
				this.setError( `Server responded with ${ response.status }` );
			}
			else
			{
				let failedUrls:string[] = [];
				let gadgets: GadgetRegistryEntry[] = [];
				let registry = response.data as GadgetRegistry;
				for( let gadget of registry.gadgets )
				{
					let [ manifest, status ] = await this.getGadgetManifest( gadget.url );
					if( status != 200 )
					{
						let newUrl = gadget.url.endsWith("/" ) ? gadget.url : gadget.url + "/";
						newUrl += "manifest.webmanifest";
						[manifest, status ] = await this.getGadgetManifest( newUrl );
					}

					if( status == 200 )
					{
						gadgets.push( 
							{ 
								...gadget, 
								manifest, 
							} );
					}
					else
					{
						failedUrls.push( gadget.url );
					}
				}
				this.setState( 
					{ 
						registry: response.data as GadgetRegistry,
						gadgets,
						failedUrls,
					} );
			}
		})
		.catch( ( reason: any) =>
		{

			this.setError( `Requested failed ${ reason }` );
		} );
	}

	private async getGadgetManifest( url: string ): Promise<[ AardvarkManifest, number ]>
	{
		try
		{
			let gadgetResponse = await axios.get( url );
			if( gadgetResponse.status == 200 )
			{
				return [ gadgetResponse.data as AardvarkManifest, 200 ];
			}
			else
			{
				return [ null, gadgetResponse.status ];
			}
		}
		catch( e )
		{
			return [ null, 403 ];
		}
	}

	private setError( error: string )
	{
		this.setState( { error } );
	}

	private findIconOfType( manifest: AardvarkManifest, mimeType: string )
	{
		if( !manifest.icons )
			return null;

		for( let icon of manifest.icons )
		{
			if( icon.type.toLowerCase() == mimeType.toLowerCase() )
			{
				return icon;
			}
		}

		return null;
	}


	private renderGadgetIcon( gadget: GadgetRegistryEntry )
	{
		let model = this.findIconOfType( gadget.manifest, "model/gltf-binary" );
		if( model )
		{
			let modelUrl = isUrl( model.src ) ? model.src : gadget.url + "/" + model.src;
			return <model-viewer src={ modelUrl } auto-rotate={ true } />;
		}
		return null;
	}

	private renderGadget( gadget: GadgetRegistryEntry )
	{

		return <div className="Gadget" key={ gadget.url }>
			<div className="GadgetName">{ gadget.manifest.name }</div>
			<div className="GadgetType">{ gadget.manifest.xr_type }</div>
			<div className="GadgetIcon">{ this.renderGadgetIcon( gadget ) }</div>
		</div>;
	}

	public render()
	{
		if( !this.state.registry )
		{
			if( this.state.error )
			{
				return <div>Registry load failed: ${ this.state.error }</div>;
			}
			else
			{
				return <div>Loading...</div>;
			}
		}

		let gadgets: JSX.Element[] = [];
		for( let gadget of this.state.gadgets )
		{
			gadgets.push( this.renderGadget(gadget) );
		}

		let failedUrls: JSX.Element[] = [];
		for( let failure of this.state.failedUrls )
		{
			failedUrls.push( <div key={ failure }>{ failure }</div> );
		}

		return <div>
			<div className="Header">Gadget registry</div> 
			<div className="Version">Minimum Aardvark version: { this.state.registry.minimumAardvarkVersion }</div> 

			<div className="Header">Gadgets</div> 
			<div className="GadgetList">{ gadgets }</div>
			
			<div className="Header">Failures</div> 
			<div className="FailedGadgetList">{ failedUrls }</div>
		</div>;
	}
}

ReactDOM.render( <GadgetRegistryPancake/>, document.getElementById( "root" ) );

