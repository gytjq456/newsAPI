let news = [];
let page = 1;
let total_pages = 0;
let btns = document.querySelectorAll('.menus button');
let schBtn = document.querySelector('#sch-btn');

btns.forEach((menu) => {
	menu.addEventListener('click', (event) => getNewsByTopic(event))
})

let url;

// 각 함수에서 필요한 url을만든다. (url이 다 다르니까)
// api호출 함수를 부른다
const getNews = async () => {
	try {
		let header = new Headers({
			'x-api-key': 'YTYj1XKIgli6v_evwXBATYsFtNJhIzCl5svGCNZZprs',
		})
		url.searchParams.set('page', page); // 파라미터 page추가
		console.log(url)
		let response = await fetch(url, { headers: header })
		let data = await response.json();
		if (response.status == 200) {
			if (data.total_hits == 0) {
				throw new Error("검색된 결과값이 없습니다.")
			}
			news = data.articles
			total_pages = data.total_pages;
			page = data.page;
			render();
			pageNation();
		} else {
			// 에러구간
			throw new Error(data.message)
		}
	} catch (error) {
		// 에러 발행하면..~
		errorRender(error.message);
	}
}


const getLatestNews = async () => {
	url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business&page_size=10');
	getNews();
}



const getNewsByTopic = async (event) => {
	let topic = event.target.textContent.toLowerCase();
	url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)
	getNews();
}

const getNewsByKeyword = async () => {
	let keyword = document.querySelector('#sch-input').value
	url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
	getNews();
}

const render = () => {
	let newsHTML = news.map((item) => {
		return `<div class="row news">
					<div class="col-lg-4">
						<img class="newsImg" src="${item.media}" alt="">
					</div>
					<div class="col-lg-8"> 
						<h2>${item.title}</h2>
						<p>
							${item.summary}
						</p>
						<div>
							${item.rights} * ${item.published_date}
						</div>
					</div>
				</div>`
	}).join('');

	document.querySelector("#new-board").innerHTML = newsHTML
}

const errorRender = (message) => {
	let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`
	document.querySelector("#new-board").innerHTML = errorHTML
}

const pageNation = () => {
	let pagentionHTML = ``;
	// total_page
	// 현재 page
	// page group 
	let pageGroup = Math.ceil(page / 5);
	// last / first 찾기
	let last = pageGroup * 5;
	// first ~ lasg print
	let first = last - 4

	if (last > total_pages) {
		last = total_pages;
	}

	if (first >= 6) {
		pagentionHTML += `
			<li class="page-item" onclick="moveToPage(1)">
				<a class="page-link" href='#js-bottom'>&lt;&lt</a>
			</li>		
			<li class="page-item">
				<a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})">
					<span aria-hidden="true">&lt;</span>
				</a>
			</li>
			`;
	}

	for (let i = first; i <= last; i++) {
		pagentionHTML += `<li class="page-item ${page == i ? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
	}

	if (last < total_pages) {
		pagentionHTML += `
			<li class="page-item">
				<a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
					<span aria-hidden="true">&gt;</span>
				</a>
			</li>
			<li class="page-item" onclick="moveToPage(${total_pages})">
			<a class="page-link" href='#js-bottom'>&gt;&gt;</a>
			</li>`;
	}

	document.querySelector(".pagination").innerHTML = pagentionHTML;
}

const moveToPage = (pageNumber) => {
	// 이동하고싶은 페이지 알기
	page = pageNumber;
	// api다시 호출
	window.scroll({
		top: 0,
		behavior: "smooth"
	})
	getNews();
}


schBtn.addEventListener('click', getNewsByKeyword)
getLatestNews();


const openNav = () => {
	document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
	document.getElementById("mySidenav").style.width = "0";
};