package com.cuckoo.oms.backoffice.rest.system;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.cuckoo.oms.core.service.system.ScmMgtService;
import com.cuckoo.oms.core.util.CommonUtil;
import com.cuckoo.oms.core.vo.system.ScmMgtVo;
import com.cuckoo.oms.core.vo.system.UserVo;
import com.google.gson.GsonBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/rest/system")
public class RestScmMgtController {

    @Autowired
    ScmMgtService scmMgtService;

    // SCM 목록 그리드 : 조회 (HashMap으로 변경)
    @PostMapping(value = "/post-scmListGrid")
    public String scmListGrid(@RequestBody HashMap vo) { 
        return new GsonBuilder().create().toJson(scmMgtService.scmListGrid(vo));
    }

    
    @PostMapping(value = "/post-save_scmListGrid")
    public String save_scmListGrid(@RequestBody ScmMgtVo vo, HttpSession session, HttpServletRequest request, HttpServletResponse response) {
        UserVo userVo = (UserVo)session.getAttribute("authUser");
        String ip = CommonUtil.getClientIp(request);
        vo.setRegId(userVo.getUserId());
        vo.setRegIp(ip);
        vo.setUpdId(userVo.getUserId());
        vo.setUpdIp(ip);
        String result = scmMgtService.save_scmListGrid(vo);
        return result;
    }

    // SCM 목록 그리드 : 삭제가능 유무 체크
    @PostMapping(value = "/post-del_scmListGridCheck")
    public String del_scmListGridCheck(@RequestBody ScmMgtVo vo) {
        return new GsonBuilder().create().toJson(scmMgtService.del_scmListGridCheck(vo));
    }

    // SCM 목록 그리드 : 삭제
    @PostMapping(value = "/post-del_scmListGrid")
    public String del_scmListGrid(@RequestBody ScmMgtVo vo) {
        return new GsonBuilder().create().toJson(scmMgtService.del_scmListGrid(vo));
    }

    // SCM 목록 그리드 : SCM 구분 셀렉트 박스
    @PostMapping(value="/get-scmClsList")
    public List<ScmMgtVo> scmClsList(ScmMgtVo vo) {
        return scmMgtService.scmClsList(vo);
    }

    // SCM 목록 그리드 : 연동 방법 셀렉트 박스
    @PostMapping(value="/get-ifMthList")
    public List<ScmMgtVo> ifMthList(ScmMgtVo vo) {
        return scmMgtService.ifMthList(vo);
    }

    // SCM 목록 그리드 : 추가 인증 셀렉트 박스
    @PostMapping(value="/get-aditConfirmList")
    public List<ScmMgtVo> aditConfirmList(ScmMgtVo vo) {
        return scmMgtService.aditConfirmList(vo);
    }

    // SCM 목록 그리드 : 셀렉트 박스 : 사용 여부
    @PostMapping(value="/get-useYnList")
    public List<ScmMgtVo> useYnList(ScmMgtVo vo) {
        return scmMgtService.useYnList(vo);
    }

}
