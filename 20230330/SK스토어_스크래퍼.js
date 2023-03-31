/**
 * SK스토어
 */
scraper.skstore = {
    // 로그인
    login : async function() {
        try {
            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // 업체코드 입력
            var entpCode = await scraper.getElement('[name="entpCode"]', 10000, 'Y');
            entpCode.val(scraperData.login.subAccountId);
            
            // ID 입력
            var id = await scraper.getElement('[name="userId"]', 10000, 'Y');
            id.val(scraperData.login.accountId);

            // PW 입력
            var pw = await scraper.getElement('[name="passwd"]', 10000, 'Y');
            pw.val(scraperData.login.accountPw);

            await cAPI.setTimeoutResume(5000);

            // 로그인 버튼 클릭
            var loginBtn = await scraper.getElement(".x-btn-inner.x-btn-inner-default-small", 10000, 'Y');
            loginBtn[1].click();

            // 중복 로그인으로 인해 팝업이 뜨면 예 버튼 클릭
            var okBtn = await scraper.getElement('span:contains("예")', 10000);
            if(okBtn) {
                okBtn.click();
            }
        } 
        catch (error) {
            await cAPI.error('[403] 로그인 실패 ' +  error.message);
        }
    },
    // 공지사항 닫기
    closeNotice: async function() {
        try {
            // 공지사항 갯수만큼 닫기
            var closeBtn = await scraper.getElement('div[id^="popupPop"] .x-tool-close', 10000);
            if(closeBtn) {
                for(var i = 0; i < closeBtn.length; i++) {
                    closeBtn[i].click();
                    await cAPI.log("#### 공지사항 닫기 ####");
                }
            }
            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 출고/배송완료등록 메뉴로 이동
    moveOrder: async function() {
        try {
            // 출고/배송완료등록 메뉴로 이동
            var tab1 = await scraper.getElement(".ux-taskbar-clear-screen", 10000, 'Y');
            tab1[0].click();
            var menu = await scraper.getElement("span:contains('출고/배송완료등록')", 10000, 'Y');
            menu.click();

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 주문 목록 다운로드
    getOrderList: async function() {
        try {
            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            // 주문이 있으면 엑셀 다운로드 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // 주문 다운로드
                var downloadBtn = await scraper.getElement("[aria-label='Save As EXCEL']", 10000, 'Y');
                downloadBtn.click();

                // 팝업에서 확인 클릭
                var okBtn = await scraper.getElement("span:contains('확인').x-btn-wrap.x-btn-wrap-default-small", 10000, 'Y');
                okBtn[0].click();
            }
            else {
                await cAPI.success('[200] 신규 주문이 없습니다.');
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 주문확인(주문번호로 검색하고 통합주문번호도 일치한지 확인할까 말까..?)
    orderConfirm: async function() {
        try {
            // 실행 중인 스크래퍼 데이터 가져오기
            var curData = await cAPI.getCurData();

            // executeYn 가져오기
            var scraperAct = await cAPI.getCurAct();

            // 주문번호 입력
            var orderNo = await scraper.getElement('input[name="order_no"]', 10000, 'Y');
            orderNo.focus();
            await scraper.delay(1000);
            await cAPI.focus();
            await scraper.delay(1000);
            await cAPI.backInput(curData.item.scmBuyNo);

            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            // 주문 1건 있으면 전체선택 클릭 후 저장 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length == 1`, 10000);
            if(isCheck) {
                // 전체선택 클릭
                var allClick = await scraper.getElement("span:contains('전체선택')", 10000, 'Y');
                allClick[0].click();
                
                if(scraperAct.executeYn == 'Y') {
                    // 저장버튼 클릭
                    var saveBtn = await scraper.getElement('[data-qtip="저장 [F9]"]', 10000, 'Y');
                    saveBtn.click();
                }

                await cAPI.setIsSuccessOrder(curData.item.omsBuyNo, true, '[200] 성공');
            }
            else {
                await cAPI.setIsSuccessOrder(curData.item.omsBuyNo, false, '[400] 해당 주문을 찾지 못 했습니다.');
            }

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    }
}