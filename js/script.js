// $(document).ready(function () {
//   // Initialize variables
//   const dropArea = $("#drop-area");
//   const fileInput = $("#font-upload");
//   let rowCount = 1;

//   // File input click handler
//   dropArea.on("click", function (e) {
//     // Only trigger if clicking directly on drop area (not children)
//     if (e.target === this) {
//       fileInput.trigger("click");
//     }
//   });

//   // File input change handler
//   fileInput.on("change", function (e) {
//     if (this.files.length > 0) {
//       uploadFont(this.files[0]);
//     }
//   });

//   // Drag and drop handlers
//   dropArea.on("dragover", function (e) {
//     e.preventDefault();
//     dropArea.addClass("dragover");
//   });

//   dropArea.on("dragleave", function () {
//     dropArea.removeClass("dragover");
//   });

//   dropArea.on("drop", function (e) {
//     e.preventDefault();
//     dropArea.removeClass("dragover");

//     if (e.originalEvent.dataTransfer.files.length) {
//       const file = e.originalEvent.dataTransfer.files[0];
//       if (file.name.toLowerCase().endsWith(".ttf")) {
//         uploadFont(file);
//       } else {
//         alert("Only TTF files are allowed.");
//       }
//     }
//   });

//   // Font upload function
//   function uploadFont(file) {
//     // Verify file type
//     if (!file.name.toLowerCase().endsWith(".ttf")) {
//       alert("Only TTF files are allowed");
//       return false;
//     }

//     const formData = new FormData();
//     formData.append("font", file);

//     $.ajax({
//       url: "upload.php",
//       type: "POST",
//       data: formData,
//       processData: false,
//       contentType: false,
//       dataType: "json",
//       success: function (response) {
//         if (response.success) {
//           // Add new font to the table
//           const newRow = `
//                       <tr data-id="${response.data.id}">
//                           <td>${response.data.name}</td>
//                           <td style="font-family: '${response.data.name}'">Example Style</td>
//                           <td><button class="delete-font" data-id="${response.data.id}">Delete</button></td>
//                       </tr>
//                   `;
//           $("#fonts-table tbody").append(newRow);

//           // Add to select options in group creation
//           $(".font-select").append(
//             `<option value="${response.data.id}">${response.data.name}</option>`
//           );

//           // Clear the file input
//           fileInput.val("");
//         } else {
//           alert(response.message);
//         }
//       },
//       error: function (xhr, status, error) {
//         alert("Error uploading font: " + error);
//         console.error("Upload error:", xhr.responseText);
//       },
//     });
//   }

//   // Delete Font
//   $(document).on("click", ".delete-font", function () {
//     const fontId = $(this).data("id");
//     const row = $(this).closest("tr");

//     if (confirm("Are you sure you want to delete this font?")) {
//       $.post("delete_font.php", { id: fontId }, function (response) {
//         if (response.success) {
//           row.remove();
//           // Remove from select options
//           $(`.font-select option[value="${fontId}"]`).remove();
//         } else {
//           alert(response.message);
//         }
//       });
//     }
//   });

//   // Font Group Management
//   $("#add-row").on("click", function () {
//     rowCount++;
//     const newRow = `
//           <div class="font-group-row" data-row="${rowCount}">
//               <span>${rowCount}</span>
//               <span>Font Name</span>
//               <select class="font-select">
//                   <option value="">Select a Font</option>
//                   ${$("#fonts-table tbody tr")
//                     .map(function () {
//                       const id = $(this).data("id");
//                       const name = $(this).find("td:first").text();
//                       return `<option value="${id}">${name}</option>`;
//                     })
//                     .get()
//                     .join("")}
//               </select>
//               <span class="checkmark">✓</span>
//           </div>
//       `;
//     $("#font-group-rows").append(newRow);
//   });

//   // Create Font Group
//   $("#create-group").on("click", function () {
//     const groupTitle = $("#group-title").val().trim();
//     if (!groupTitle) {
//       alert("Please enter a group title");
//       return;
//     }

//     // Get selected fonts
//     const selectedFonts = [];
//     $(".font-select").each(function () {
//       const fontId = $(this).val();
//       if (fontId) {
//         selectedFonts.push(fontId);
//       }
//     });

//     // Validate at least 2 fonts selected
//     if (selectedFonts.length < 2) {
//       $("#group-validation").show();
//       return;
//     }
//     $("#group-validation").hide();

//     // Create the group
//     $.ajax({
//       url: "create_group.php",
//       type: "POST",
//       data: {
//         name: groupTitle,
//         font_ids: selectedFonts.join(","),
//       },
//       dataType: "json",
//       success: function (response) {
//         if (response.success) {
//           // Add new group to the table
//           const fontsList = selectedFonts
//             .map((id) => {
//               return $(`#fonts-table tr[data-id="${id}"] td:first`).text();
//             })
//             .join(", ");

//           const newRow = `
//                       <tr data-id="${response.group_id}">
//                           <td>${groupTitle}</td>
//                           <td>${fontsList}</td>
//                           <td>${selectedFonts.length}</td>
//                           <td>
//                               <button class="edit-group" data-id="${response.group_id}">Edit</button>
//                               <button class="delete-group" data-id="${response.group_id}">Delete</button>
//                           </td>
//                       </tr>
//                   `;
//           $("#font-groups-table tbody").prepend(newRow);

//           // Reset the form
//           $("#group-title").val("");
//           $("#font-group-rows").html(`
//                       <div class="font-group-row" data-row="1">
//                           <span>1</span>
//                           <span>Font Name</span>
//                           <select class="font-select">
//                               <option value="">Select a Font</option>
//                               ${$("#fonts-table tbody tr")
//                                 .map(function () {
//                                   const id = $(this).data("id");
//                                   const name = $(this).find("td:first").text();
//                                   return `<option value="${id}">${name}</option>`;
//                                 })
//                                 .get()
//                                 .join("")}
//                           </select>
//                           <span class="checkmark">✓</span>
//                       </div>
//                   `);
//           rowCount = 1;
//         } else {
//           alert(response.message);
//         }
//       },
//       error: function (xhr, status, error) {
//         alert("Error creating group: " + error);
//         console.error("Group creation error:", xhr.responseText);
//       },
//     });
//   });

//   // Delete Font Group
//   $(document).on("click", ".delete-group", function () {
//     const groupId = $(this).data("id");
//     const row = $(this).closest("tr");

//     if (confirm("Are you sure you want to delete this font group?")) {
//       $.post("delete_group.php", { id: groupId }, function (response) {
//         if (response.success) {
//           row.remove();
//         } else {
//           alert(response.message);
//         }
//       });
//     }
//   });

//   // Edit Font Group (simplified - would load into form)
//   $(document).on("click", ".edit-group", function () {
//     const groupId = $(this).data("id");
//     const row = $(this).closest("tr");
//     const groupName = row.find("td:first").text();
//     const fontIds = row
//       .find("td:nth-child(2)")
//       .text()
//       .split(",")
//       .map((f) => f.trim());

//     // For demo purposes - in a real app you would load this into the form
//     alert(
//       `Would load group "${groupName}" for editing with ${fontIds.length} fonts`
//     );

//     // This would be the actual implementation:
//     // 1. Fetch group details from server
//     // 2. Populate the form fields
//     // 3. Change "Create" button to "Update"
//     // 4. Handle the update via AJAX
//   });
// });

$(document).ready(function () {
  // Initialize variables
  const dropArea = $("#drop-area");
  const fileInput = $("#font-upload");
  let rowCount = 1;
  let currentEditingGroupId = null;

  // File input click handler
  dropArea.on("click", function (e) {
    if (e.target === this) {
      fileInput.trigger("click");
    }
  });

  // File input change handler
  fileInput.on("change", function (e) {
    if (this.files.length > 0) {
      uploadFont(this.files[0]);
    }
  });

  // Drag and drop handlers
  dropArea.on("dragover", function (e) {
    e.preventDefault();
    dropArea.addClass("dragover");
  });

  dropArea.on("dragleave", function () {
    dropArea.removeClass("dragover");
  });

  dropArea.on("drop", function (e) {
    e.preventDefault();
    dropArea.removeClass("dragover");

    if (e.originalEvent.dataTransfer.files.length) {
      const file = e.originalEvent.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith(".ttf")) {
        uploadFont(file);
      } else {
        alert("Only TTF files are allowed.");
      }
    }
  });

  // Font upload function
  function uploadFont(file) {
    if (!file.name.toLowerCase().endsWith(".ttf")) {
      alert("Only TTF files are allowed");
      return false;
    }

    const formData = new FormData();
    formData.append("font", file);

    $.ajax({
      url: "upload.php",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const newRow = `
                      <tr data-id="${response.data.id}">
                          <td>${response.data.name}</td>
                          <td style="font-family: '${response.data.name}'">Example Style</td>
                          <td><button class="delete-font" data-id="${response.data.id}">Delete</button></td>
                      </tr>
                  `;
          $("#fonts-table tbody").append(newRow);
          $(".font-select").append(
            `<option value="${response.data.id}">${response.data.name}</option>`
          );
          fileInput.val("");
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        alert("Error uploading font: " + error);
        console.error("Upload error:", xhr.responseText);
      },
    });
  }

  // Delete Font
  $(document).on("click", ".delete-font", function () {
    const fontId = $(this).data("id");
    const row = $(this).closest("tr");

    if (confirm("Are you sure you want to delete this font?")) {
      $.post("delete_font.php", { id: fontId }, function (response) {
        if (response.success) {
          row.remove();
          $(`.font-select option[value="${fontId}"]`).remove();
        } else {
          alert(response.message);
        }
      });
    }
  });

  // Add Row for Font Group
  $("#add-row").on("click", function () {
    rowCount++;
    const newRow = `
          <div class="font-group-row" data-row="${rowCount}">
              <span>${rowCount}</span>
              <span>Font Name</span>
              <select class="font-select">
                  <option value="">Select a Font</option>
                  ${$("#fonts-table tbody tr")
                    .map(function () {
                      const id = $(this).data("id");
                      const name = $(this).find("td:first").text();
                      return `<option value="${id}">${name}</option>`;
                    })
                    .get()
                    .join("")}
              </select>
              <span class="checkmark">✓</span>
              <button class="remove-row btn btn-sm btn-danger">×</button>
          </div>
      `;
    $("#font-group-rows").append(newRow);
  });

  // Remove Row from Font Group
  $(document).on("click", ".remove-row", function () {
    $(this).closest(".font-group-row").remove();
    // Renumber remaining rows
    $(".font-group-row").each(function (index) {
      $(this)
        .find("span:first")
        .text(index + 1);
      $(this).attr("data-row", index + 1);
    });
    rowCount = $(".font-group-row").length;
  });

  // Create/Update Font Group
  $("#create-group").on("click", function () {
    const groupTitle = $("#group-title").val().trim();
    if (!groupTitle) {
      alert("Please enter a group title");
      return;
    }

    const selectedFonts = [];
    $(".font-select").each(function () {
      const fontId = $(this).val();
      if (fontId) {
        selectedFonts.push(fontId);
      }
    });

    if (selectedFonts.length < 2) {
      $("#group-validation").show();
      return;
    }
    $("#group-validation").hide();

    const isEditing = currentEditingGroupId !== null;
    const url = isEditing ? "update_group.php" : "create_group.php";
    const data = {
      name: groupTitle,
      font_ids: selectedFonts.join(","),
    };

    if (isEditing) {
      data.id = currentEditingGroupId;
    }

    $.ajax({
      url: url,
      type: "POST",
      data: data,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          refreshGroupsList();
          resetGroupForm();
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        alert("Error: " + error);
        console.error("Error:", xhr.responseText);
      },
    });
  });

  // Delete Font Group
  $(document).on("click", ".delete-group", function () {
    const groupId = $(this).data("id");
    const row = $(this).closest("tr");

    if (confirm("Are you sure you want to delete this font group?")) {
      $.post("delete_group.php", { id: groupId }, function (response) {
        if (response.success) {
          row.remove();
        } else {
          alert(response.message);
        }
      });
    }
  });

  // Edit Font Group
  $(document).on("click", ".edit-group", function () {
    currentEditingGroupId = $(this).data("id");
    const row = $(this).closest("tr");
    const groupName = row.find("td:first").text();
    const fontIds = row.data("font-ids").split(",");

    // Load data into form
    $("#group-title").val(groupName);
    $("#font-group-rows").empty();
    rowCount = 0;

    // Add rows for each font in the group
    fontIds.forEach((fontId) => {
      if (!fontId) return;

      rowCount++;
      const fontName = $(
        `#fonts-table tr[data-id="${fontId}"] td:first`
      ).text();
      const newRow = `
              <div class="font-group-row" data-row="${rowCount}">
                  <span>${rowCount}</span>
                  <span>Font Name</span>
                  <select class="font-select">
                      <option value="">Select a Font</option>
                      ${$("#fonts-table tbody tr")
                        .map(function () {
                          const id = $(this).data("id");
                          const name = $(this).find("td:first").text();
                          const selected = id == fontId ? "selected" : "";
                          return `<option value="${id}" ${selected}>${name}</option>`;
                        })
                        .get()
                        .join("")}
                  </select>
                  <span class="checkmark">✓</span>
                  ${
                    rowCount > 1
                      ? '<button class="remove-row btn btn-sm btn-danger">×</button>'
                      : ""
                  }
              </div>
          `;
      $("#font-group-rows").append(newRow);
    });

    // Change button text
    $("#create-group")
      .text("Update Group")
      .removeClass("btn-success")
      .addClass("btn-warning");

    // Scroll to form
    $("html, body").animate(
      {
        scrollTop: $(".section").offset().top,
      },
      500
    );
  });

  // Helper function to refresh groups list
  function refreshGroupsList() {
    $.get(
      "get_groups.php",
      function (response) {
        if (response.success) {
          $("#font-groups-table tbody").empty();
          response.data.forEach((group) => {
            const newRow = `
                      <tr data-id="${group.id}" data-font-ids="${group.font_ids}">
                          <td>${group.name}</td>
                          <td>${group.fonts}</td>
                          <td>${group.count}</td>
                          <td>
                              <button class="edit-group btn btn-sm btn-info" data-id="${group.id}">Edit</button>
                              <button class="delete-group btn btn-sm btn-danger" data-id="${group.id}">Delete</button>
                          </td>
                      </tr>
                  `;
            $("#font-groups-table tbody").append(newRow);
          });
        }
      },
      "json"
    );
  }

  // Helper function to reset the form
  function resetGroupForm() {
    $("#group-title").val("");
    currentEditingGroupId = null;
    $("#create-group")
      .text("Create")
      .removeClass("btn-warning")
      .addClass("btn-success");
    $("#font-group-rows").html(`
          <div class="font-group-row" data-row="1">
              <span>1</span>
              <span>Font Name</span>
              <select class="font-select">
                  <option value="">Select a Font</option>
                  ${$("#fonts-table tbody tr")
                    .map(function () {
                      const id = $(this).data("id");
                      const name = $(this).find("td:first").text();
                      return `<option value="${id}">${name}</option>`;
                    })
                    .get()
                    .join("")}
              </select>
              <span class="checkmark">✓</span>
          </div>
      `);
    rowCount = 1;
  }
});
