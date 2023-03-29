scraper['11st'] = {    
    login: async function() {
        try {
            var scraperData = await cAPI.getData();

            // 11번가 ID의 SELECTOR가 둘 중 하나가 랜덤으로 나와서 해당하는 SELECTOR 찾아서 입력
            var $id;
            var id1     = await scraper.getElement('#user-id', 10000);
            var id2     = await scraper.getElement('#loginName', 10000);

            if(id1) {
                $id = id1;
            }
            else if(id2) {
                $id = id2;
            }

            var $pw     = await scraper.getElement('#passWord', 10000, 'Y');
            var $login  = await scraper.getElement('#loginbutton', 10000, 'Y');

            $id.val(scraperData.login.accountId);
            $pw.val(scraperData.login.accountPw);
            await cAPI.setTimeoutResume(3000);
            $login.click();
        }
        catch (error) {
            await cAPI.error(error.message);
        }
    }
}