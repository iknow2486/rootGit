scraper.interpark = {
    // 취소 수집 다운로드
    getCancelList: async function() {
        try {
            // 검색 조건 한 달로 셋팅
            var $month = await scraper.getElement("[data-ipss-value='-1m']", 10000, 'Y');
            $month.click();

            // 해당 부분 추가
            // 상태 전체로 변경
            var stat = await scraper.getElement("#claimOrderStatus", 10000, 'Y');
            stat.val('').trigger('change');

            // 검색 버튼 클릭
            var $search = await scraper.getElement("#searchBtn", 10000, 'Y');
            $search.click();

            await scraper.delay(5000);

            var isRows = await scraper.isCheck('com.interpark.ipss.view.cancelRequest.gridData.length > 0', 10000);
            if(!isRows) {
                await cAPI.success('[200] 신규 취소 목록이 없습니다.');
                return;
            }

            var $btnDownload = await scraper.getElement('div.gridTitleArea > div > div:nth-child(1) > button:nth-child(2)', 3000, 'Y');
            $btnDownload.click();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    }
}