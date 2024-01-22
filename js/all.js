$('#reg_btn, #login_btn').on('click', function () {
	$('body, #navbar').css({
		overflow: 'auto',
		'padding-right': 0
	})
})

$('#race a').on('click', function () {
	$('#race a').removeClass('active')
	$(this).addClass('active')
})

// swiper ---------------------------------------------------------------------------------------------
var swiper = new Swiper(".swiper", {
    effect: "cube",
    grabCursor: true,
    cubeEffect: {
        shadow: false,
        slideShadows: false,
        shadowOffset: 20,
        shadowScale: 0.94,
    },
    pagination: {
        el: ".swiper-pagination",
	},
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
    autoplay: {
        delay: 5000, // 設定輪播的延遲時間，以毫秒為單位
    },
    loop: true, // 啟用循環
});
// follow ball
gsap.set(".follow-ball", {xPercent: -50, yPercent: -50});

let targets = gsap.utils.toArray(".follow-ball"); 

window.addEventListener("mousemove", e => {
  gsap.to(targets, {
    duration: 0.1,
    x: e.clientX, // 使用 clientX 取得滑鼠在視窗中的 x 座標
    y: e.clientY, // 使用 clientY 取得滑鼠在視窗中的 y 座標
    ease: "none",
    overwrite: "auto",
    stagger: 0.035,
  });
});


// GSAP ---------------------------------------------------------------------------------------------
// 註冊 plugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText)

// ScrollToPlugin ------------------------------------------------------------------------------------
// 點擊按鈕時，頁面滑動到指定位置
$('#navbar .main-link, .backtop a').each(function (index) {
	$(this).on('click', function (e) {
		e.preventDefault() // 取消預設行為
		if ($(this).attr('href') === '#section04' || $(this).attr('href') === '#section05') {
			gsap.to($(window), {
				scrollTo: {
					y: `#section0${index + 1}`
				},
				duration: 1.5,
				ease: 'back.inOut'
			})
		} else {
			gsap.to($(window), {
				scrollTo: {
					y: `#section0${index + 1}`,
					offsetY: 150
				},
				duration: 1.5,
				ease: 'back.inOut'
			})
		}
	})
})
// 導覽列滾動收合 ------------------------------------------------------------------------------------
gsap.from('#navbar', {
	yPercent: -100,
	paused: false,
	duration: 0.5,
	scrollTrigger: {
		start: 'top 60',
		end: () => '+=' + document.documentElement.scrollHeight, // end 整份文件的高度
		onEnter(self) {
			// console.log(self)
			self.animation.play()
		},
		onUpdate(self) {
			// console.log(self.direction) // -1 往上滾動，1 往下滾動
			self.direction === -1 ? self.animation.play() : self.animation.reverse() // -1 往上正向播放， 1 往下反向播放
		}
		// markers: true
	}
})

// backtop ------------------------------------------------------------------------------------
gsap.to('.backtop', {
	scrollTrigger: {
		trigger: '#footer',
		start: 'top bottom',
		end: '100% bottom',
		toggleActions: 'play none none reverse'
	},
	display: 'block',
	opacity: 1,
	duration: 1
})

// 導覽列 active 的位置 ------------------------------------------------------------------------------------
$('.main-link').each(function (index, link) {
	let id = $(link).attr('href') // #section01、#section02 ...
	// console.log(id)
	gsap.to(link, {
		scrollTrigger: {
			trigger: id, // 拿 #srction01~#section05 當觸發點
			start: 'top center', // 設定觸發範圍
			end: 'bottom center',
			// 觸發時加上 active 這個 class
			toggleClass: {
				targets: link,
				className: 'active'
			}
			// markers: true
		}
	})
})

// 視差效果 ---------------------------------------------------------------------------------------------
// 星空背景
gsap.to('body', {
	scrollTrigger: {
		trigger: 'body',
		start: 'top 0%',
		end: 'bottom 0%',
		scrub: 5
		// markers: true
	},
	backgroundPosition: '50% 100%',
	ease: 'none'
})

// 空島
// 用時間軸控制不同的角色演員做進場動畫
const float_tl = gsap.timeline({
	scrollTrigger: {
		trigger: 'body',
		start: 'top 0%',
		end: 'bottom 0%',
		scrub: 5
		// markers: true
	},
	ease: 'none'
})

float_tl
	.from('.float-wrap-01', {
		left: '-30%'
	})
	.from(
		'.float-wrap-02',
		{
			right: '-30%'
		},
		'<'
	)
	.from(
		'.float-wrap-03',
		{
			bottom: '-100%'
		},
		'<'
	)

// 自己上下浮動的動畫
$('.float-island').each(function (index, island) {
	gsap.to(island, {
		y: 50 * (index + 1),
		duration: 10 * (index + 1),
		repeat: -1,
		yoyo: true,
		ease: 'power1.inOut'
	})
})

// 用值是 function 也可以達到上面的效果
// gsap.to('.float-island', {
// 	y: function (index, target, targets) {
// 		return 50 * (index + 1)
// 	},
// 	duration: function (index, target, targets) {
// 		return 10 * (index + 1)
// 	},
// 	repeat: -1,
// 	yoyo: true,
// 	ease: 'power1.inOut'
// })

// 霧
$('.fog').each(function (index, fog) {
	// 也可以用 set 來設定樣式的初始值
	gsap.set(fog, {
		width: '100%',
		height: '100%',
		background: 'url("../images/fog.png") no-repeat center/80%',
		opacity: 0.8,
		position: 'absolute',
		top: 'random(0, 100)' + '%',
		// 設定偶數的霧要從左邊進場，奇數的霧要從右邊進場
		x: function () {
			return index % 2 === 0 ? -$(window).width() : $(window).width()
		}
	})
	// to 是做補間動畫
	gsap.to(fog, {
		x: function () {
			return index % 2 === 0 ? $(window).width() : -$(window).width()
		},
		// 動畫重複播放時執行的函式
		onRepeat() {
			// 將霧的 top 設定為隨機值
			$(fog).css({
				top: gsap.utils.random(0, 100) + '%'
			})
		},
		repeat: -1,
		duration: 10,
		ease: 'none'
	})
})

// 流星
// 1. 創建流星
function createStar(starNumber) {
	for (let i = 0; i < starNumber; i++) {
		$('.shooting_star').append('<div class="star"></div>')
	}
	const stars = gsap.utils.toArray('.star') // 轉成陣列
	return stars
}

// 2. 設定流星補間動畫預設值
function setStarTween(stars) {
	gsap.set('.shooting_star', {
		perspective: 800
	})
	stars.forEach(function (star, index) {
		gsap.set(star, {
			transformOrigin: '0 50%',
			position: 'absolute',
			left: gsap.utils.random($(window).width() / 2, $(window).width() * 2),
			top: gsap.utils.random(-100, -100),
			rotation: -25
		})
	})
	return stars
}

// 3. 流星動畫
function playStarTimeline(stars) {
	const tl = gsap.timeline({
		repeat: -1
	})

	tl.to(stars, {
		x: '-=' + $(window).width() * 1.5, // 流星往左飛
		y: '+=' + $(window).height() * 1.5, // 流星往下飛
		z: 'random(-100, 500)',
		stagger: function (index) {
			return gsap.utils.random(index + 5, (index + 5) * 2, 1)
		},
		duration: 'random(0.5, 3, 0.1)', // 0.5~3 秒，0.5、0.6、0.7 ... 2.9、3
		ease: 'none'
	})
}

const playStar = gsap.utils.pipe(createStar, setStarTween, playStarTimeline)
playStar(30)

// SplitText ------------------------------------------------------------------------------------
gsap.set('#splitText', {
	perspective: 400
})

const tl = gsap.timeline({
	repeat: -1,
	repeatDelay: 8
})

// 將段落轉成陣列
const paragraphs = gsap.utils.toArray('#splitText p')
console.log(paragraphs)

const splitTexts = paragraphs.map(function (p) {
	return new SplitText(p, {
		charsClass: 'charBg'
	})
})

console.log(splitTexts)

splitTexts.forEach(function (splitText) {
	const chars = splitText.chars
	tl.from(
		chars,
		{
			y: 80,
			rotationX: 0,
			rotationY: 180,
			scale: 2,
			transformOrigin: '0% 50% -100',
			opacity: 0,
			duration: 2,
			ease: 'back',
			stagger: 0.1,
			onComplete() {
				gsap.to(chars, {
					delay: 3,
					duration: 2,
					opacity: 0,
					scale: 2,
					y: 80,
					rotationX: 180,
					rotationY: 0,
					transformOrigin: '0% 50% -100',
					ease: 'back',
					stagger: 0.1
				})
			}
		},
		'+=4'
	)
})
