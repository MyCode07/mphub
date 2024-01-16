const mapIconPath = '/wp-content/themes/blank-sheet/assets/img/icons/map-icon.svg';
const map = document.querySelector('#contacts-map');
const zoom = 17;
const defLat = 55.649479
const defLong = 37.404312

export const createMap = () => {
    if (!map) return;

    ymaps.ready(function () {
        const myMap = new ymaps.Map(map, {
            center: [defLat, defLong],
            zoom: zoom,
        });

        var myPlacemark = new ymaps.Placemark(
            [defLat, defLong],
            {},
            {
                iconLayout: 'default#image',
                iconImageHref: mapIconPath,
                iconImageSize: [70, 70]
            }
        );

        myMap.geoObjects.add(myPlacemark);
    });
}