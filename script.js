(function () {
	'use strict';

	var C = window.PORTFOLIO || {};

	/* ---------- tiny helpers (text is always set with textContent, never as HTML) ---------- */
	function el(tag, cls, text, attrs) {
		var node = document.createElement(tag);
		if (cls) { node.className = cls; }
		if (text !== undefined && text !== null) { node.textContent = text; }
		if (attrs) { Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); }); }
		return node;
	}
	function add(parent) {
		for (var i = 1; i < arguments.length; i++) { if (arguments[i]) { parent.appendChild(arguments[i]); } }
		return parent;
	}
	function lineSpans(text) {
		var h = document.createDocumentFragment();
		String(text || '').split('|').slice(0, 2).forEach(function (part) { h.appendChild(el('span', null, part.trim())); });
		return h;
	}
	function safeUrl(u) { return /^(https?:\/\/|images\/|\.\/|\/)/i.test(u || '') ? u : ''; }
	var $ = function (sel) { return document.querySelector(sel); };

	/* ---------- page basics ---------- */
	var name = String(C.name || '').trim();
	var parts = name.split(/\s+/);
	var first = parts.shift() || '';
	var last = parts.join(' ');
	var fullName = (first + ' ' + last).trim();

	document.title = C.siteTitle || fullName || 'Portfolio';
	var meta = $('meta[name="description"]');
	if (meta) { meta.setAttribute('content', (fullName ? fullName + ' – ' : '') + (C.role || 'Art portfolio')); }
	$('#site-name').textContent = fullName || 'Portfolio';
	$('#copyright').textContent = '© ' + new Date().getFullYear() + ' ' + fullName;
	if (/^#[0-9a-f]{3,8}$/i.test(C.accent || '')) { document.documentElement.style.setProperty('--pink', C.accent); }

	/* ---------- hero ---------- */
	var hero = $('#top');
	var notes = C.notes || [];
	[0, 1, 2].forEach(function (i) {
		if (notes[i]) { add(hero, el('p', 'hand hero__note hero__note--' + (i + 1), notes[i])); }
	});
	var h1 = el('h1', 'hero__name bubble');
	h1.style.setProperty('--chars', Math.max(4, first.length, last.length));
	add(h1, el('span', 'hero__first', first), last ? el('span', 'hero__last', last) : null);
	add(hero, h1);
	if (safeUrl(C.heroImage)) {
		var fig = el('figure', 'hero__photo halftone');
		add(fig, el('img', null, null, { src: C.heroImage, alt: fullName, fetchpriority: 'high' }));
		add(hero, fig);
	}
	add(hero, el('p', 'hero__role', C.role || ''), el('p', 'hero__by', fullName ? 'By ' + fullName : ''));

	/* ---------- about ---------- */
	var about = $('#about');
	var media = el('div', 'about__media');
	if (safeUrl(C.aboutImage)) {
		add(media, add(el('figure', 'polaroid polaroid--tilt-l'), el('span', 'tape', null, { 'aria-hidden': 'true' }), el('img', null, null, { src: C.aboutImage, alt: '', loading: 'lazy' })));
	} else {
		add(media, add(el('div', 'polaroid polaroid--tilt-l polaroid--empty', null, { 'aria-hidden': 'true' }), el('span', 'tape'), el('span', 'hand', 'photo goes here')));
	}
	add(media, el('span', 'scribble', null, { 'aria-hidden': 'true' }));

	var body = el('div', 'about__body');
	var h2 = el('h2', 'shout');
	h2.appendChild(lineSpans(C.aboutHeadline));
	add(body, h2);

	if (C.handle) {
		var chip = el('p', 'chip');
		if (safeUrl(C.instagram)) {
			add(chip, el('a', null, C.handle, { href: C.instagram, rel: 'noopener', target: '_blank' }));
		} else {
			chip.textContent = C.handle;
		}
		add(body, chip);
	}

	var cols = el('div', 'about__cols');
	var text = el('div', 'about__text');
	(C.aboutText || []).forEach(function (p) { add(text, el('p', null, p)); });
	add(cols, text);
	if ((C.aboutList || []).length) {
		var list = el('div', 'about__list');
		var ul = el('ul');
		C.aboutList.forEach(function (item) { add(ul, el('li', null, item)); });
		add(list, el('p', 'hand', 'I do:'), ul);
		add(cols, list);
	}
	add(body, cols);
	add(about, media, body);

	/* ---------- works ---------- */
	var grid = $('#works-grid');
	var works = (C.works || []).filter(function (w) { return w && safeUrl(w.image); });
	if (works.length) {
		works.forEach(function (w, i) {
			var detail = w.detail || '';
			var fig = el('figure', 'work');
			var a = el('a', 'work__link', null, { href: w.image, 'data-index': String(i) });
			add(a, el('img', 'work__img', null, { src: w.image, alt: w.title || ('Artwork ' + (i + 1)), loading: i < 3 ? 'eager' : 'lazy', decoding: 'async' }));
			var cap = el('figcaption', 'work__cap');
			add(cap, w.title ? el('span', 'work__title', w.title) : null, detail ? el('span', 'work__detail', detail) : null);
			add(fig, a, cap);
			add(grid, fig);
		});
	} else {
		grid.className += ' works__grid--empty';
		for (var i = 0; i < 6; i++) {
			add(grid, add(el('figure', 'work work--empty', null, { 'aria-hidden': 'true' }), el('div', 'work__ph'), add(el('figcaption', 'work__cap'), el('span', 'work__title', 'your artwork'))));
		}
	}

	/* ---------- contact (the form opens the visitor's own email app) ---------- */
	var contact = $('#contact');
	var email = String(C.email || '');
	var h2c = el('h2', 'shout shout--right');
	h2c.appendChild(lineSpans(C.contactHeading));
	add(contact, h2c);

	var links = el('ul', 'contact__links');
	if (email) { add(links, add(el('li'), el('a', null, email, { href: 'mailto:' + email }))); }
	if (safeUrl(C.instagram)) { add(links, add(el('li'), el('a', null, C.handle || C.instagram, { href: C.instagram, rel: 'noopener', target: '_blank' }))); }
	add(contact, links);

	var env = el('div', 'envelope');
	var form = el('form', 'note');
	add(form, el('p', 'note__intro hand', C.contactNote || ''));
	function field(label, input) { return add(el('label', 'note__field'), el('span', null, label), input); }
	var inName = el('input', null, null, { type: 'text', name: 'name', autocomplete: 'name', required: 'required' });
	var inMail = el('input', null, null, { type: 'email', name: 'email', autocomplete: 'email', required: 'required' });
	var inMsg = el('textarea', null, null, { name: 'message', rows: '4', required: 'required' });
	var send = el('button', 'btn btn--ink', 'Send by email', { type: 'submit' });
	var hint = el('p', 'note__status note__status--ok', 'Your email app should open with the message ready to send.', { role: 'status', hidden: 'hidden' });
	add(form, field('Name', inName), field('Email', inMail), field('Message', inMsg), hint, send);
	form.addEventListener('submit', function (e) {
		e.preventDefault();
		if (!email) { return; }
		var subject = 'Message from ' + inName.value.trim();
		var bodyText = inMsg.value.trim() + '\n\n--\n' + inName.value.trim() + ' <' + inMail.value.trim() + '>';
		window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
		hint.hidden = false;
	});
	add(env, el('div', 'envelope__back', null, { 'aria-hidden': 'true' }), form, el('div', 'envelope__front', null, { 'aria-hidden': 'true' }));
	add(contact, env);

	/* ---------- mobile menu ---------- */
	var header = $('.site-header');
	var toggle = $('.nav-toggle');
	toggle.addEventListener('click', function () {
		var open = header.classList.toggle('is-open');
		toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
	});
	header.addEventListener('click', function (e) {
		if (e.target.closest && e.target.closest('.site-nav a')) {
			header.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
		}
	});

	/* ---------- lightbox ---------- */
	var box = $('.lightbox');
	var img = box.querySelector('.lightbox__img');
	var cap = box.querySelector('.lightbox__caption');
	var closeBtn = box.querySelector('.lightbox__close');
	var prev = box.querySelector('.lightbox__nav--prev');
	var next = box.querySelector('.lightbox__nav--next');
	var current = 0;
	var lastFocus = null;

	function show(i) {
		current = (i + works.length) % works.length;
		var w = works[current];
		img.src = w.image;
		img.alt = w.title || '';
		cap.textContent = [w.title, w.detail].filter(Boolean).join(' · ');
		var many = works.length > 1;
		prev.hidden = next.hidden = !many;
	}
	function open(i, trigger) {
		lastFocus = trigger;
		show(i);
		box.hidden = false;
		document.body.style.overflow = 'hidden';
		closeBtn.focus();
	}
	function close() {
		box.hidden = true;
		img.removeAttribute('src');
		document.body.style.overflow = '';
		if (lastFocus) { lastFocus.focus(); }
	}

	document.addEventListener('click', function (e) {
		var link = e.target.closest ? e.target.closest('.work__link') : null;
		if (link) { e.preventDefault(); open(parseInt(link.getAttribute('data-index'), 10) || 0, link); return; }
		if (box.hidden) { return; }
		if (e.target === box || e.target === closeBtn) { close(); }
		else if (e.target === prev) { show(current - 1); }
		else if (e.target === next) { show(current + 1); }
	});
	document.addEventListener('keydown', function (e) {
		if (box.hidden) { return; }
		if (e.key === 'Escape') { close(); }
		else if (e.key === 'ArrowLeft') { show(current - 1); }
		else if (e.key === 'ArrowRight') { show(current + 1); }
	});
})();
