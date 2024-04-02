export default function callAjax(URL, data, beforeSend, complete) {
    return $.ajax({
        url: `${URL}`,
        contentType: "application/json",
        dataType: 'json',
        data: data,
        beforeSend: function () {
            if (beforeSend) beforeSend();
        }
        , success: function (data) {
            return data
        },
        complete: function (param) {
            if (complete) complete();
        }
    })
}