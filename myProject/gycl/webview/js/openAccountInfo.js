$(function(){
    //查询省列表
    dictionaryQuery(0);
    //查询市列表
    $("#province").change(function(){
        var provinceCode = $(this).val();
        dictionaryQuery(1,provinceCode);
    });
})


//查询省列表
function dictionaryQuery(queryType,provinceCode){
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"dictionaryQuery",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            queryType: queryType,
            provinceCode: provinceCode,
        },
        function(data){
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
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}
