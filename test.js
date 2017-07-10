const extract = require('./index')

extract({
		url: 'https://docs.google.com/forms/d/e/1FAIpQLSfGg1a02mJkh9uCdxq2qRROoN-GVmPoNe1pq8uvxV762Lbppw/viewform'
	})
	.then(console.log)
	.catch(console.error)
