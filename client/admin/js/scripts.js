import { CATEGORIES, NEWS } from "./const.js";
import { Category, News } from "./type.js";
import { formatDate } from "./utils.js";
$(".nav-item.dropdown").on("click", function () {
  $(".dropdown-menu").toggleClass("show");
  $(".nav-link.dropdown-toggle").toggleClass("show");
});

$(document).ready(function () {
  const formCreate = $("#modal__create form");
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

  const table = $("#data").DataTable({
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
      handleOpenForm();
    },
  });
  function handleOpenForm() {
    // 1. Click "create"
    $("#btn__create").on("click", function () {
      // 2 setupForm()
      setupForm();
    });
  }
  var editorContent = "";
  const setupForm = () => {
    const selectCategory = formCreate.find(`select[name="category[]"]`)[0];

    //3. getCategories()
    getCategories().then((data) => {
      // 4. setCategories()
      $(selectCategory).selectize({
        plugins: ["restore_on_backspace", "clear_button"],
        delimiter: " - ",
        persist: false,
        maxItems: null,
        options: data,
        valueField: "id",
        labelField: "name",
        searchField: "text",
      });
    });
    // 5. configTextEditor()
    configTextEditor();
    // 6. createForm()
    validate();
  };

  const configTextEditor = () => {
    // Froala Editor
    const selectorEditor = formCreate.find("textarea[name='content']")[0];
    const editor = new FroalaEditor(selectorEditor, {
      events: {
        contentChanged: function () {
          editorContent = editor.html.get();
        },
      },
    });
  };

  const getCategories = () => {
    return $.ajax({
      url: CATEGORIES,
      type: "GET",
      success: function (data) {
        return data.map((item) => ({
          value: item.id,
          text: item.name,
        }));
      },
    });
  };

  const validate = () => {
    $(formCreate).on("submit", function (e) {
      e.preventDefault();
    });
    // 8. validate() + //9, showError()
    formCreate.validate({
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
      // 10 submitForm())
      submitHandler: function (form) {
        //11 handleSubmit()
        handleSubmit(form);
      },
    });
  };

  const handleSubmit = (form) => {
    const formData = new FormData(form);
    const news = new News();
    formData.forEach(function (value, key) {
      if (key == "category[]") {
        const category = new Category(parseInt(value));
        news.addCategory(category);
      } else news[key] = value;
    });
    news.createdAt = new Date().toISOString();
    // 12 titleExist
    titleExist().then((data) => {
      if (data.length > 0) {
        Swal.fire({
          title: "Failed!",
          text: "Title already exists!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        // 13 addNews()
        addNews(news);
      }
    });
  };

  function addNews(news) {
    $.ajax({
      url: NEWS,
      type: "POST",
      data: JSON.stringify(news),
      contentType: "application/json",
      success: function () {
        // 14. Show Notify
        Swal.fire({
          title: "Success!",
          text: "News has been added successfully!",
          icon: "success",
        });
        table.ajax.reload();
      },
      error: function () {
        Swal.fire({
          title: "Failed!",
          text: "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
  }

  function titleExist(title) {
    return $.ajax({
      url: `${NEWS}?_title=${title}`,
      type: "GET",
      success: function (data) {
        return data;
      },
    });
  }
});
