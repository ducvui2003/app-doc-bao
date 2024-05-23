import { CATEGORIES, NEWS } from "./const.js";
import { Category, News } from "./type.js";
import { formatDate } from "./utils.js";
$(".nav-item.dropdown").on("click", function () {
  $(".dropdown-menu").toggleClass("show");
  $(".nav-link.dropdown-toggle").toggleClass("show");
});

$(document).ready(function () {
  $.validator.addMethod(
    "urlCheck",
    function (value, element) {
      // Regular expression for URL validation
      var urlRegex =
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
      return this.optional(element) || urlRegex.test(value);
    },
    "Please enter a valid URL."
  );
  // Load data table first
  $("#data").DataTable({
    ajax: {
      url: NEWS,
      dataSrc: "",
    },
    columnDefs: [
      {
        targets: 1,
        width: "40%",
        className: "ellipsis",
      },
      {
        targets: 3,
        render: function (data, type, row) {
          return formatDate(data);
        },
      },
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
                    `;
        },
      },
    ],
    initComplete: function () {
      $("#btn__create").on("click", function () {
        modalCreate();
      });
      // modalDeleteBtn();
      // modalUpdateBtn();

      // modalDelete();
      // modalUpdate();

      // setupForm("#form__edit");
    },
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

    modalCreate.find("#btn__delete").click(function () {
      $.ajax({
        url: `${NEWS}/${idDelete}`,
        method: "DELETE",
        success: function () {
          modalDelete.hide();
          $("#data").DataTable().ajax.reload(null, false);
        },
      });
    });
    setupForm("#form__add");
  }

  function modalUpdate() {
    const modalUpdate = $("#modal__edit");
    modalUpdate.find(".btn__modal-delete").click(function () {
      $.ajax({
        url: `${NEWS}/${idDelete}`,
        method: "DELETE",
        success: function () {
          modalDelete.hide();
          $("#data").DataTable().ajax.reload(null, false);
        },
      });
    });
  }

  function modalDelete() {
    const modelDelete = $("#modal__delete");
    modelDelete.find(".btn__modal-delete").click(function () {
      $.ajax({
        url: `${NEWS}/${idDelete}`,
        method: "DELETE",
        success: function () {
          modelDelete.hide();
          $("#data").DataTable().ajax.reload(null, false);
        },
      });
    });
  }
  function setupForm(formSelector, data) {
    let editorContent = "";
    const selectCategory = `${formSelector} select[name="category[]"]`;

    getCategories();
    configTextEditor();
    validate();

    // configTextEditor
    function configTextEditor() {
      // Froala Editor
      const selectorEditor = `${formSelector} .content`;
      const editor = new FroalaEditor(selectorEditor, {
        events: {
          contentChanged: function () {
            editorContent = editor.html.get();
          },
        },
      });
    }

    // getCategories
    function getCategories() {
      $.ajax({
        url: CATEGORIES,
        type: "GET",
        success: function (data) {
          const selectOptions = data.map((item) => ({
            value: item.id,
            text: item.name,
          }));
          $(selectCategory).selectize({
            plugins: ["restore_on_backspace", "clear_button"],
            delimiter: " - ",
            persist: false,
            maxItems: null,
            options: selectOptions,
            valueField: "value",
            labelField: "text",
            searchField: "text",
          });
        },
      });
    }

    // Validate
    function validate() {
      $(formSelector).validate({
        rules: {
          author: {
            required: true,
            minlength: 5,
          },
          title: {
            required: true,
            minlength: 5,
          },

          source: {
            required: true,
            urlCheck: true,
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
            urlCheck: true,
          },
        },
        messages: {
          title: {
            required: "Title is required",
            minlength: "Title must be at least 5 characters",
          },
          author: {
            required: "Author is required",
            minlength: "Author must be at least 5 characters",
          },
          source: {
            required: "Source is required",
            urlCheck: "Please enter a valid URL",
          },
          "category[]": {
            required: "Please select at least one category",
          },
          shortDescription: {
            required: "Short description is required",
            minlength: "Short description must be at least 100 characters",
          },
          content: {
            required: "Content is required",
            minlength: "Content must be at least 5 characters",
          },
          thumbnail: {
            required: "Thumbnail is required",
            urlCheck: "Please enter a valid URL",
          },
        },
        validClass: "is-valid",
        errorClass: "is-invalid",
        errorPlacement: function (error, element) {
          $(element).next().text(error.text());
        },
        highlight: function (element, errorClass, validClass) {
          $(element)
            .addClass(errorClass)
            .removeClass(validClass)
            .attr("required", "required");
          $(element).next().addClass("invalid-feedback");
        },
        unhighlight: function (element, errorClass, validClass) {
          $(element)
            .removeClass(errorClass)
            .addClass(validClass)
            .removeAttr("required");
          $(element).next().text("");
        },
        submitHandler: function (form) {
          const formData = new FormData(form);
          const news = new News();
          formData.forEach(function (value, key) {
            if (key == "category[]") {
              const category = new Category(parseInt(value));
              news.addCategory(category);
            } else news[key] = value;
          });
          news.createdAt = new Date().toISOString();
          $.ajax({
            url: NEWS,
            type: "POST",
            data: JSON.stringify(news),
            contentType: "application/json",
            success: function (response) {
              Swal.fire({
                title: "Success!",
                text: "News has been added successfully!",
                icon: "success",
              });
            },
            error: function (xhr, status, error) {
              Swal.fire({
                title: "Failed!",
                text: "Something went wrong!",
                icon: "error",
                confirmButtonText: "OK",
              }).then((result) => {
                // Check if the "OK" button is clicked
                if (result.isConfirmed) {
                  // Close the modal
                  Swal.close();
                }
              });
            },
          });
        },
      });
    }
  }
  // const configFroala = {
  //   imageUploadParam: "image_param",

  //   // Set the image upload URL.
  //   imageUploadURL: "/",

  //   // Additional upload params.
  //   imageUploadParams: { id: "my_editor" },

  //   // Set request type.
  //   imageUploadMethod: "POST",

  //   // Set max image size to 5MB.
  //   imageMaxSize: 5 * 1024 * 1024,

  //   // Allow to upload PNG and JPG.
  //   imageAllowedTypes: ["jpeg", "jpg", "png"],
  //   events: {
  //     "image.uploaded": function (response) {
  //       // Response from server containing image URL
  //       const imageURL = response.link;
  //       // Insert uploaded image to the editor
  //       this.image.insert(imageURL, false, { alt: "Uploaded Image" });
  //     },
  //   },
  // };

  // $("#form__upload button").on("click", function (e) {
  //   e.preventDefault();
  //   const file = $("#form__upload input[type='file']").prop("files")[0];
  //   uploadImage(file);
  // });
});
