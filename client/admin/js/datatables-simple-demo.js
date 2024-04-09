$(document).ready(function () {
    const URL = "http://localhost:3000/news";
    function formatDate(dateString) {
        var formattedDate = new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        return formattedDate;
    }
    // Load data table first
    $("#data").DataTable({
        ajax: {
            url: URL,
            dataSrc: ''
        },
        columnDefs: [
            {
                targets: 1,
                width: '40%',
                className: 'ellipsis',

            },
            {
                targets: 3,
                render: function (data, type, row) {
                    return formatDate(data);
                }
            }
        ],
        columns: [
            { data: "id" },
            { data: "title" },
            { data: "author" },
            { data: "createAt" },
            {
                data: "id",
                render: function (data, type, row) {
                    return `
                    <button data-id=${data}" data-bs-toggle="modal" data-bs-target="#modal__edit" class="btn-update d-block w-100 btn btn-primary">Edit</button>
                    <button class="btn__delete d-block w-100 btn btn-danger mt-2" data-id=${data} data-bs-toggle="modal" data-bs-target="#modal__delete">Delete</button>
                    `
                }
            }
        ],
        initComplete: function () {
            modalDeleteBtn();
            modalUpdateBtn();
            modalCreate();
            modalDelete();
            modalUpdate();
            setupForm("#form__add");
            setupForm("#form__edit");
        }
    });
    // save id want to delete
    let idDelete;
    let idUpdate;

    function modalDeleteBtn() {
        $(".btn__delete").each(function (index, element) {
            $(element).click(function () {
                idDelete = $(element).data("id");
            });
        });
    }
    function modalUpdateBtn() {
        $(".btn-update").each(function (index, element) {
            $(element).click(function () {
                idUpdate = $(element).data("id");
            });
        });
    }

    function modalCreate() {
        const modalCreate = $("#modal__create");
        // Validate form

        modalCreate.find("#btn__delete").click(function () {
            $.ajax({
                url: `${URL}/${idDelete}`,
                method: "DELETE",
                success: function () {
                    modalDelete.hide();
                    $("#data").DataTable().ajax.reload(null, false);
                }
            });
        });
    }

    function modalUpdate() {
        const modalUpdate = $("#modal__edit");
        modalUpdate.find(".btn__modal-delete").click(function () {
            $.ajax({
                url: `${URL}/${idDelete}`,
                method: "DELETE",
                success: function () {
                    modalDelete.hide();
                    $("#data").DataTable().ajax.reload(null, false);
                }
            });
        });
    }

    function modalDelete() {
        const modelDelete = $("#modal__delete");
        modelDelete.find(".btn__modal-delete").click(function () {
            $.ajax({
                url: `${URL}/${idDelete}`,
                method: "DELETE",
                success: function () {
                    modelDelete.hide();
                    $("#data").DataTable().ajax.reload(null, false);
                }
            });
        });
    }
    function setupForm(formSelector, data) {
        $.validator.addMethod("urlCheck", function (value, element) {
            // Regular expression for URL validation
            var urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            return this.optional(element) || urlRegex.test(value);
        }, "Please enter a valid URL.");

        // Froala
        let editorContent = "";
        const selectorEditor = `${formSelector} .content`;
        const editor = new FroalaEditor(selectorEditor, {
            events: {
                'contentChanged': function () {
                    editorContent = editor.html.get();
                }
            }
        });
        const selectCategory = `${formSelector} .select__category`;
        $.ajax({
            url: "http://localhost:3000/categories",
            type: "GET",
            success: function (data) {
                const selectOptions = data.map(item => ({
                    value: item,
                    text: item
                }));
                $(selectCategory).selectize({
                    plugins: ["restore_on_backspace", "clear_button"],
                    delimiter: " - ",
                    persist: false,
                    maxItems: null,
                    options: selectOptions,
                    valueField: 'value',
                    labelField: 'text',
                    searchField: 'text'
                });
            }
        })

        // Apply validate form
        $(formSelector).validate({
            rules: {
                author: {
                    required: true,
                    minlength: 5
                },
                title: {
                    required: true,
                    minlength: 5
                },

                source: {
                    required: true,
                    urlCheck: true
                },
                "category[]": {
                    required: true,
                },
                shortDescription: {
                    required: true,
                    minlength: 100,
                },
                content: {
                    required: true,
                    minlength: 5,
                },
                thumbnail: {
                    required: true,
                    urlCheck: true
                }
            }
            , messages: {
                title: {
                    required: "Title is required",
                    minlength: "Title must be at least 5 characters"
                },
                author: {
                    required: "Author is required",
                    minlength: "Author must be at least 5 characters"
                }
                ,
                source: {
                    required: "Source is required",
                    urlCheck: "Please enter a valid URL"
                },
                'category[]': {
                    required: "Please select at least one category"
                },
                shortDescription: {
                    required: "Short description is required",
                    minlength: "Short description must be at least 100 characters"
                },
                content: {
                    required: "Content is required",
                    minlength: "Content must be at least 5 characters"
                },
                thumbnail: {
                    required: "Thumbnail is required",
                    urlCheck: "Please enter a valid URL"
                }
            },
            validClass: 'is-valid',
            errorClass: 'is-invalid',
            errorPlacement: function (error, element) {
                $(element).next().text(error.text());
            },
            highlight: function (element, errorClass, validClass) {
                $(element).addClass(errorClass).removeClass(validClass).attr('required', 'required');
                $(element).next().addClass("invalid-feedback");
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).removeClass(errorClass).addClass(validClass).removeAttr('required');
                $(element).next().text("");
            },
            submitHandler: function (form) {
                // Submit form via AJAX
                var formData = new FormData(form);

                var jsonData = {};
                formData.forEach(function (value, key) {
                    jsonData[key] = value;
                });
                jsonData.createdAt = new Date().toISOString()
                console.log(jsonData);
                $.ajax({
                    url: "http://localhost:3000/news",
                    type: "POST",
                    data: JSON.stringify(jsonData),
                    contentType: "application/json",
                    success: function (response) {
                        console.log(response);
                        Swal.fire({
                            title: "Success!",
                            text: "News has been added successfully!",
                            icon: "success"
                        });
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            title: "Failed!",
                            text: "Something went wrong!",
                            icon: "error",
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            // Check if the "OK" button is clicked
                            if (result.isConfirmed) {
                                // Close the modal
                                Swal.close();
                                modalUpdate.hide();
                            }
                        });
                    }
                });
                return false;
            }
        });
    }
});
