import React from 'react';

import './ListHeader.css';

const ListHeader = ({ title }) => (
	<header className='ListHeader'>
		<span className='app-title'>{ title }</span>
	</header>
);

export default ListHeader;
