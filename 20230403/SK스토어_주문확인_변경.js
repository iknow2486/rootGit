/**
 * SK스토어
 */
scraper.skstore = {
    // 인증번호 발신 번호(아직 받지 않아서 모르겠음)
    authFromNo: '',
    // 인증번호 수신 일자
    authDttm: null,
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
            // 핸드폰 인증 팝업이 뜨면 확인 버튼 클릭 후 인증 진행
            var okBtn = await scraper.getElement('span:contains("예")', 10000);
            var certPop = await scraper.getElement('span:contains("확인")', 10000);
            if(okBtn) {
                okBtn.click();
            }
            else if(certPop) {
                certPop.click();

                // 인증번호 받기 버튼 클릭
                var getCert = await scraper.getElement('span:contains("인증번호 받기")', 10000, 'Y');
                getCert.click();

                // 인증번호 입력
                var authNo = await scraper.getElement('[name="AUTH_NUMBER"]', 10000, 'Y');

                // 인증번호 요청 시간 설정
                scraper.skstore.authDttm = new Date();

                await scraper.delay(5000);

                // 당일 인증요청한 인증번호 목록을 할당
                var auths = [];

                // 필터 처리한 인증번호
                var filterAuths = [];

                // 인증 요청한 시간 이후에 들어온 인증번호를 필터
                do {
                    auths = await cAPI.getAuthNo(scraperData.login.accountTel, scraper.skstore.authFromNo);

                    if(auths && auths.length > 0) {
                        // 인증번호 추출
                        filterAuths = auths.filter((auth) => {
                            var regDttm = new DataTransfer(auth.regDttm);
                            return scraper.skstore.authDttm <= regDttm;
                        });
                    } 
                    await scraper.delay(1000);
                }
                while(filterAuths.length <= 0);

                // 인증 시도
                for(var i = 0; i < filterAuths.length; i++) {
                    await cAPI.log(`#### 인증번호 : ${filterAuths[i].otherAuthCode} ####`);
                    authNo.val(filterAuths[i].otherAuthCode);
                }

                // 인증확인 버튼 클릭
                var authNoOk = await scraper.getElement('span:contains("인증확인")', 10000, 'Y');
                authNoOk.click();
            }

            await cAPI.resume();
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

                // 팝업에서 확인 버튼 클릭
                var okBtn = await scraper.getElement("span:contains('확인').x-btn-wrap.x-btn-wrap-default-small", 10000, 'Y');
                okBtn[0].click();

                // 사유 입력
                var reason = await scraper.getElement('[name="DOWN_REASON"]', 10000, 'Y');
                reason.val('OMS 업무');

                // 사유 입력 후 확인 버튼 클릭
                var okBtn2 = await scraper.getElement("span:contains('확인').x-btn-wrap.x-btn-wrap-default-small", 10000, 'Y');
                okBtn2[1].click();
            }
            else {
                await cAPI.success('[200] 신규 주문이 없습니다.');
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 주문확인(CHECK_YN = '1'로 하면 체크 되는 거 같음)
    orderConfirm: async function() {
        try {
            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // executeYn 가져오기
            var scraperAct = await cAPI.getCurAct();

            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            // 주문 1건 있으면 전체선택 클릭 후 저장 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length > 0`, 20000);
            if(isCheck) {
                // SCM 그리드 데이터 가져오기
                var gridData = Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange();
                    
                // 일치하는 주문 찾아서 체크
                for(var order of scraperData.orderList) {
                    for(var i = 0; i < gridData.length; i++) {
                        if(order.val5 == gridData[i].data.PROCESS_NO) {
                            gridData[i].data.CHECK_YN = '1';
                            order.successYn = 'Y';
                            await scraper.delay(500);
                            break;
                        }
                    }
                }

                // 저장 버튼 클릭
                var saveBtn = await scraper.getElement('', 10000, 'Y');
                if(scraperAct.executeYn == 'Y') {
                    saveBtn.click();
                }
            }

            // 성공 / 실패 여부 판단
            for(var order of scraperData.orderList) {
                if(order.successYn == 'Y') {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, true, '[200] 성공');
                }
                else {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, false, '[400] 해당 하는 주문을 찾지 못했습니다.');
                }
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    }
}