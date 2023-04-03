/**
 * 쇼핑엔티
 */
 scraper.shoppingnt = {
    // 일치하는 데이터 찾아서 체크
    dataCheck: async function() {
        try {
            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();    

            // 스크래퍼 executeYn 가져오기
            var scraperAct = await cAPI.getCurAct();

            // 판넬 ID 가져오기
            var grid = await scraper.getElement('div[id^="cwaregridpanel-"]', 10000, 'Y');
            
            // ext.js 활용하여 그리드 데이터 가져오기
            var gridData = Ext.getCmp(grid[4].id).store.getData().getRange();

            // 조회된 데이터가 1건 이상이면
            if(gridData.length > 0) {
                for(var order of scraperData.orderList) {
                    for(var i = 0; i < gridData.length; i++) {
                        if(order.scmBuyNo == gridData[i].data.PROCESS_NO) {
                            gridData[i].data.CHECK_YN = '1';
                            order.successYn = 'Y';
                            await scraper.delay(500);
                            break;
                        }
                    }
                }

                await scraper.delay(2000);

                // 출고예정일 오늘 + 2일로 변경(2023-04-03 추가)
                var today = await scraper.addDays(2, '/');
                var outPlanDate = await scraper.getElement('[name="OUT_PLAN_DATE"]');
                outPlanDate.val(today).trigger('change');

                await scraper.delay(2000);

                // 출고예정일 버튼 클릭
                var dateBtn = await scraper.getElement('span:contains("출고예정일 적용")', 10000, 'Y');
                dateBtn.click();
                
                await scraper.delay(1500);
    
                // alert창의 확인 버튼 클릭
                var ok = await scraper.getElement('.x-btn-wrap-default-small', 10000, 'Y');
                ok[2].click();
                
                await scraper.delay(1500);
    
                // 지연사유등록 기타로 변경 & 지연사유등록 버튼 클릭
                var select = await scraper.getElement('.x-form-arrow-trigger-default', 10000, 'Y');
                select[2].click();

                await scraper.delay(1500);

                var selectChk = await scraper.getElement('li:contains("기타")', 10000, 'Y');
                selectChk.click();        

                await scraper.delay(1500);      

                var regBtn = await scraper.getElement('span:contains("지연사유등록")', 10000, 'Y');
                regBtn.click();
                
                await scraper.delay(1500);
    
                // alert창의 확인 버튼 클릭
                var ok = await scraper.getElement('.x-btn-wrap-default-small', 10000, 'Y');
                ok[2].click();
                
                await scraper.delay(1500);
    
                // 저장 버튼 클릭
                var icon = await scraper.getElement('.x-tool-default.x-tool-after-title', 10000, 'Y');
                icon[3].click();

                // 최종 저장 버튼 클릭
                if(scraperAct.executeYn == 'Y') {
                    var ok = await scraper.getElement('.x-btn-wrap-default-small', 10000, 'Y');
                    ok[3].click();
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

            await cAPI.log('#### 출하지시 처리 완료 ####');
            await cAPI.resume();
        }
        catch (error) {
            await cAPI.error(error.message);
        }
    }
};