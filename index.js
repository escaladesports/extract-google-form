const cheerio = require('cheerio')
const fetch = require('isomorphic-fetch')
module.exports = opt => {
	opt = Object.assign(opt, {
		type: 'iframe',
		onSubmit: 'Thank you for your submission!',
		cb: console.log
	})

	fetchPage(opt)
		.then(parsePage)
		.then(opt.cb)
		.catch(console.error)

}

function fetchPage(opt){
	return new Promise((resolve, reject) => {
		fetch(opt.url)
			.then(res => {
				if(res.status >= 400){
					reject(new Error('Bad response from server'))
				}
				else if(res.status === 200){
					res.text()
						.then(str => {
							opt.text = str
							resolve(opt)
						})
				}
			})
			.catch(reject)
	})
}

function parsePage(opt){
	const $ = cheerio.load(opt.text)
	const inputs = $.html('form [name]:not([name="draftResponse"], [name="pageHistory"], [name="fbzx"], [name="fvv"])')
	const form = $('form')
	form.html(inputs)
	form.append('<input type="submit" value="Send" />')
	const formEls = $('form, input, textarea, select, option')
	formEls.removeAttr('target')
		.removeAttr('id')
		.removeAttr('class')
		.removeAttr('data-initial-value')
		.removeAttr('data-initial-dir')
		.removeAttr('dir')
		.removeAttr('jsname')
		.removeAttr('jscontroller')
		.removeAttr('jsaction')
		.removeAttr('tabindex')
		.removeAttr('data-rows')
		.removeAttr('autocomplete')
		.removeAttr('aria-describedby')

	// Insert iframe
	if(opt.type === 'iframe'){
		form.attr('target', 'hiddenIframe')
	}

	let str = $.html('form')
	if(opt.type === 'iframe'){
		str += '<iframe id="hiddenIframe" style="display:none"></iframe>'
	}

	return str
}


module.exports({
		url: 'https://docs.google.com/forms/d/e/1FAIpQLSddJdEE9L33vj_jJqh3joHL2SdPX8A95Tj900YK3P4G98NNWw/viewform'
	})
