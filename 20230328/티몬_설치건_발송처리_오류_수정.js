scraper.tmon = {
    /**
     * 주문구분에 따라 발송처리 할 리스트 정의하기
     */
    setOrderList: async function(val) {
        try {
            // OMS 주문 목록
            var scraperData = await cAPI.getData();
            var omsOrderList = scraperData.orderList;
            var iOrderList = [];
            var curCompy = {};

            if(val == 'D') {
                for(var dOrder of omsOrderList) {
                    if(dOrder.buyCls == '1') {
                        if(!curCompy[dOrder.scmCurCompyCd]) {
                            curCompy[dOrder.scmCurCompyCd] = [];
                        }

                        curCompy[dOrder.scmCurCompyCd].push(dOrder);
                    }
                }

                await cAPI.addData("curCompy", curCompy);                   // length가 0인 List를 addData를 하면 오류 발생 -> 택배 주문이 들어왔을 경우에만 addData 하게끔 수정 
            } 
            else if(val == 'I') {
                for(var iOrder of omsOrderList) {
                    if(iOrder.buyCls == '3') {
                        var today = await scraper.getToday();
                        iOrder.deliveryDate = today;
                        iOrderList.push(iOrder);
                    }
                }
            }

            // 주문구분별 리스트 재할당
            // await cAPI.addData("curCompy", curCompy);
            scraper.setItem("iOrderList", iOrderList);

            await cAPI.resume();
        } 
        catch (error) {
            await cAPI.error(error.message); 
        }
    }
}