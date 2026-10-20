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
	function safeUrl(u) { return /^(https?:\/\/|images\/|files\/|\.\/|\/)/i.test(u || '') ? u : ''; }
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
		if (!notes[i]) { return; }
		// Every letter gets its own span (hidden at first) so the layout never jumps while typing.
		// Screen readers get the full sentence from a hidden copy.
		var p = el('p', 'hand hero__note hero__note--' + (i + 1));
		var typed = el('span', 'tw-chars', null, { 'aria-hidden': 'true' });
		String(notes[i]).split('').forEach(function (ch) { add(typed, el('span', 'tw', ch)); });
		add(p, el('span', 'screen-reader-text', notes[i]), typed);
		add(hero, p);
	});
	// Types the notes out one after another, like keys being pressed.
	function typeNotes() {
		var t = 350;                 // wait before the first key
		var perLetter = 32;          // ms per letter: lower = faster
		var pauseBetween = 260;      // ms pause between notes
		Array.prototype.forEach.call(hero.querySelectorAll('.hero__note'), function (note) {
			Array.prototype.forEach.call(note.querySelectorAll('.tw'), function (letter) {
				t += /\s/.test(letter.textContent) ? perLetter * 0.6 : perLetter;
				setTimeout(function () { letter.classList.add('on'); }, t);
			});
			t += pauseBetween;
		});
	}
	var h1 = el('h1', 'hero__name bubble');
	h1.style.setProperty('--chars', Math.max(4, first.length, last.length));
	add(h1, el('span', 'hero__first', first), last ? el('span', 'hero__last', last) : null);
	add(hero, h1);
	if (safeUrl(C.heroImage)) {
		var fig = el('figure', 'hero__photo halftone');
		add(fig, el('img', null, null, { src: C.heroImage, alt: fullName, fetchpriority: 'high' }));
		add(hero, fig);
	}
	(C.heroFlowers || []).forEach(function (f) {
		if (!f || !safeUrl(f.image)) { return; }
		var flower = el('img', 'hero__flower', null, { src: f.image, alt: '', 'aria-hidden': 'true' });
		flower.style.left = f.left || '0';
		flower.style.top = f.top || '0';
		flower.style.width = f.size || '25%';
		var spin = Number(f.spin) || 24;
		flower.style.animationDuration = Math.abs(spin) + 's';
		if (spin < 0) { flower.style.animationDirection = 'reverse'; }
		add(hero, flower);
	});
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

	/* ---------- my story ---------- */
	var storyTitle = $('#story-title');
	if (storyTitle && C.storyHeading) { storyTitle.textContent = C.storyHeading; }
	var chapters = $('#story-chapters');
	(C.story || []).forEach(function (ch, i) {
		if (!ch) { return; }
		var article = el('article', 'story__chapter' + (i % 2 ? ' story__chapter--flip' : ''));
		add(article, el('p', 'story__text', ch.text || ''));
		var photos = el('div', 'story__photos');
		(ch.photos || []).slice(0, 2).forEach(function (p, j) {
			if (!p || !safeUrl(p.image)) { return; }
			var fig = el('figure', 'polaroid story__photo story__photo--' + (j + 1));
			add(fig,
				el('span', 'tape', null, { 'aria-hidden': 'true' }),
				el('img', null, null, { src: p.image, alt: p.alt || p.label || 'Photo of me', loading: 'lazy' }),
				p.label ? el('figcaption', 'hand story__label', p.label) : null);
			add(photos, fig);
		});
		add(photos, el('span', 'story__squiggle', null, { 'aria-hidden': 'true' }));
		add(article, photos, ch.highlight ? el('p', 'story__highlight', ch.highlight) : null);
		if (i < C.story.length - 1) {
			add(article, el('span', 'story__connector' + (i % 2 ? ' story__connector--rtl' : ''), null, { 'aria-hidden': 'true' }));
		}
		add(chapters, article);
	});

	/* ---------- resume ---------- */
	var resumeTitle = $('#resume-title');
	if (resumeTitle && C.resumeHeading) { resumeTitle.textContent = C.resumeHeading; }
	var resumeCard = $('#resume-card');
	if (safeUrl(C.resumeLink)) {
		add(resumeCard,
			el('span', 'tape', null, { 'aria-hidden': 'true' }),
			el('p', 'resume__note hand', C.resumeNote || ''),
			add(el('a', 'btn btn--ink', (C.resumeButton || 'Open my CV') + ' ↗', { href: C.resumeLink, target: '_blank', rel: 'noopener' })));
	} else {
		resumeCard.hidden = true;
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

	/* ---------- dotted arrows draw themselves in when scrolled into view ---------- */
	var arrows = document.querySelectorAll('.scribble, .story__squiggle, .story__connector');
	var calm = false; // animations always play, whatever the visitor's system animation setting says
	if (!calm) {
		// "anim" = motion is allowed; "loaded" = images and fonts are in, so the hero notes can play their intro now
		document.documentElement.classList.add('anim');
		var ready = function () { document.documentElement.classList.add('loaded'); typeNotes(); };
		if (document.readyState === 'complete') { ready(); } else { window.addEventListener('load', ready); }
	}
	if (arrows.length && !calm) {
		var pending = Array.prototype.slice.call(arrows);
		pending.forEach(function (a) { a.classList.add('draw'); });
		// Position check instead of IntersectionObserver: a clipped (not yet drawn) arrow counts as invisible to it.
		var ticking = false;
		var check = function () {
			ticking = false;
			pending = pending.filter(function (a) {
				var r = a.getBoundingClientRect();
				if (r.top < window.innerHeight * 0.85 && r.bottom > 0) { a.classList.add('is-drawn'); return false; }
				return true;
			});
			if (!pending.length) {
				window.removeEventListener('scroll', onScroll);
				window.removeEventListener('resize', onScroll);
			}
		};
		var onScroll = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(check); } };
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		window.addEventListener('load', onScroll);
		check();
	}

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