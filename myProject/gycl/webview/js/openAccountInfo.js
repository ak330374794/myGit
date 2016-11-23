$(function(){
    //查询省列表
    dictionaryQuery(0);
    professionalQuery();
    //查询市列表
    $("#province").change(function(){
        var provinceCode = $(this).val();
        if(!provinceCode){
            $("#city").html("");
            $("#city").append('<option value="">请选择市/区城市</option>');
        }else{
            dictionaryQuery(1,provinceCode);
        }
    });

})


//查询省列表
function dictionaryQuery(queryType,provinceCode){
    if(!provinceCode){
        $("#city").html("");
        $("#city").append('<option value="">请选择市/区城市</option>');
    }
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl()+"provinceAndCityQuery",
        data:{
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            queryType: queryType,
            provinceCode: provinceCode,
        },
        dataType: 'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                if(queryType == 0){
                    $("#province").html("");
                    $("#province").append('<option value="">请选择省市</option>');
                    $(a.dictionaryDetailModel).each(function(i,n){
                        var proList = '<option value="'+n.provinceCode+'">'+n.provinceName+'</option>';
                        $("#province").append(proList);
                    });
                }else{
                    $("#city").html("");
                    $("#city").append('<option value="">请选择市/区城市</option>');
                    $(a.dictionaryDetailModel).each(function(i,n){
                        var cityList = '<option value="'+n.cityCode+'">'+n.cityName+'</option>';
                        $("#city").append(cityList);
                    });
                }
                
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                $.cookie("token",a.token);
            }else{
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        },
        error: function(data){
            hideLoading();
            if(data.statusText == "timeout"){
                errorShowAlert("请求超时");
            }else if (data.status == "200"){
                setErrorMsg(data.resp_code, data.resp_msg);
            }else{
                errorShowAlert("服务器异常");
            }
        }
    })
}




//查询职业列表
function professionalQuery(){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl()+"professionalQuery",
        data:{
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
        },
        dataType: 'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                $("#profession").html("");
                $("#profession").append('<option value="">请选择职业</option>');
                $(a).each(function(i,n){
                    var profession = '<option value="'+n.itemValue+'">'+n.itemName+'</option>';
                    $("#profession").append(profession);
                });
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                $.cookie("token",a.token);
            }else{
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        },
        error: function(data){
            hideLoading();
            if(data.statusText == "timeout"){
                errorShowAlert("请求超时");
            }else if (data.status == "200"){
                setErrorMsg(data.resp_code, data.resp_msg);
            }else{
                errorShowAlert("服务器异常");
            }
        }
    })
}