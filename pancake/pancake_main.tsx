import { observer } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';


interface GadgetRegistryPancakeState
{
}

@observer
class GadgetRegistryPancake extends React.Component< {}, GadgetRegistryPancakeState >
{

	constructor( props: any )
	{
		super( props );
	}

	public render()
	{
		return <div> Hello world</div>;
	}
}

ReactDOM.render( <GadgetRegistryPancake/>, document.getElementById( "root" ) );

