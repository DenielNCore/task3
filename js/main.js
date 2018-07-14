const ITEMS_KEY = 'current';
const ITEMS_FAV = 'favorite';


let checked =JSON.parse(localStorage.getItem(ITEMS_FAV) || null) || {};
let items = JSON.parse(localStorage.getItem(ITEMS_KEY) || null) || [];

if(items.length>0) tableSpawn();
spawnUniList(items);
updateChecked();
checkedCount();

function loadUniversity(){
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json', true);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status !== 200) {
                // обработать ошибку
                alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);
            } else if($(`main`).children().length===0) {
                    // вывести результат
                let country =$(`textarea`).val().toLowerCase();

                    let x = JSON.parse(xhr.responseText);
                    x = x.filter((item) => {
                        return item.country.toLowerCase() === country;
                    });

                    // x = x.map((item)=> {
                    //     item.web_pages =item[web_pages].reduce((sum, cur, i, arr)=> {
                    //         return sum+ cur + (i==arr.length-1) ? "" : `">`;
                    //     },"")
                    //     console.dir(item.web_pages);
                    // });
                if(x.length>0) tableSpawn();
                spawnUniList(x);
                checkedCount();
                localStorage.setItem(ITEMS_KEY, JSON.stringify(x));
                //console.dir(country);

            }
        };
}

function tableSpawn() {
    $(`<table>
                    <tr>
                        <th>num</th>
                        <th>Web pages</th>
                        <th>University name</th>
                        <th>Alpha two code</th>
                        <th>State-province</th>
                        <th>Domains</th>
                        <th>Country</th>
                        <th>Сохранить в мой список</th>
                    </tr>
                </table>`).appendTo(`main`);
}

function spawnUniList(x) {
    x.forEach((item, index)=>{
        let web = item.web_pages.map((item)=>{
            return item+`">`+item;
        }).join(`</a>\n<a href="`);
        $(`<tr data-id="${index+1}">
                    <td>${index+1}</td>
                    <td><a href="${web}</a></td>
                    <td>${item.name}</td>
                    <td>${item.alpha_two_code}</td>
                    <td>${item.state_province}</td>
                    <td>${item.domains}</td>
                    <td>${item.country}</td>
                    <td><input class="saveToMy" type="checkbox"></td>
                </tr>`).appendTo(`table`);
    });
}

$(`.reset`).on(`click`, ()=>{
    resetAres();
});

function resetAres() {
    $(`textarea`).val('');
    $(`table`).remove();
    $(`.counter`).val(`В сохраненных 0`);
    localStorage.clear();
}

function checkedCount() {
    $(`.saveToMy`).on(`click`, (event)=>{
        let id = getId(event);
        checked[id] = event.target.checked;
        localStorage.setItem(ITEMS_FAV, JSON.stringify(checked));
        checkedCounter();
    });
}

function checkedCounter() {
    $(`.counter`).val(`В сохраненных ${$(`td`).find('input[type=checkbox]:checked').length}`);
}

function updateChecked() {
    for( let key in checked) {
        console.dir(checked[key]);
        if(!checked[key]) {
            $(`*[data-id="${key}"]`).children().eq(7).children().attr('checked', false);
        } else {$(`*[data-id="${key}"]`).children().eq(7).children().attr('checked', true);}
    }
    checkedCounter();
}

function getId(event) {
   let item = event.target;
   return $(item).closest(`tr`).data(`id`);
}