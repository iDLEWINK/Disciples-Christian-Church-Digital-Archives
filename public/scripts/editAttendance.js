$(document).ready(function () {


  $("#edit-date-button").click(function () {

    var userHasClickedDate = checkSelectedDate()

    if (userHasClickedDate == false)
      return

    var selectedDate = $(".e-selected").children("span").attr("title")
    var dateSplit = selectedDate.split(",");
    var dayAndMonth = dateSplit[1]
    var yearEdit = dateSplit[2]
    dayAndMonth = dayAndMonth.split(" ")

    var monthEdit = dayAndMonth[1]
    var dayEdit = dayAndMonth[2]

    monthEdit = convertMonth(monthEdit)

    var formattedDateToday = yearEdit + "-" + monthEdit.toString().padStart(2, '0') + "-" + dayEdit.toString().padStart(2, '0')
    formattedDateToday = formattedDateToday.trim()

    const formattedDate = new Date(formattedDateToday)
    const data = {}
    data.date = formattedDate

    $.ajax({
      type: 'POST',
      data: data,
      url: '/check_attendance_date',
      success: function (result) {
        if (!result) {
          location.href = `edit_attendance/${formattedDateToday}`
        } else {
          //prompt the user if they would like to add a record instead of editing or just say that it doesnt exist yet so pick another date
          $("#redirectEditModal").modal('show')

          $("#no-attendance-text").text(`No attendance record on ${formattedDateToday}, add a new record?`)

          $("#add-new-date-btn").click(function () {
            location.href = '/add_attendance'
          })
        }
      }
    })
  })

  if ($("#non_member_row").children().length < 1 && $("#member_row").children().length < 1) {
    $('#redirectAddModal').modal({
      backdrop: 'static',
      keyboard: false
    })
    $("#redirectAddModal").modal('show')
    var url = window.location.href
    var dateTodayUnformatted = url.split('edit_attendance/')[1]
    const today = new Date(dateTodayUnformatted)

    $('#edit-date').val(today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0'))

    $("#change-date-btn").click(function () {
      // make date picker display the current date beforet this to avoid null value 
      // date format 2021-11-29T00:00:00.000Z
      var date = $("#edit-date").val()
      const formattedDate = new Date(date)
      const data = {}
      data.date = formattedDate

      $.ajax({
        type: 'POST',
        data: data,
        url: '/check_attendance_date',
        success: function (result) {
          if (!result) {
            location.href = `edit_attendance/${date}`
          } else {
            //prompt the user if they would like to add a record instead of editing or just say that it doesnt exist yet so pick another date
            $('#create-attendance').prop('disabled', false)
            var option = confirm(`No attendance record found on ${date}, add a new attendance record?`)

            if (option) {
              location.href = "/add_attendance"
            }

          }
        }
      })
    })
  }


  $("#date").attr('readonly', 'readonly');

  var urlWindow = window.location.href
  var dateChosenToday = urlWindow.split('edit_attendance/')[1]
  var newDate = new Date(dateChosenToday);
  

  var calendar = new ej.calendars.Calendar({
    value: newDate
  });
  var samplebutton = $("#edit-date-button")
  var errorDateMsg = $("#error-date")
  calendar.appendTo('#element')
  samplebutton.appendTo("#element")
  errorDateMsg.appendTo("#element")

  $(document).on("click", ".e-cell", function () {
    $("#error-date").css("color", "white")
  });

  var year = "", month = "", day = ""
  var url = window.location.href
  var dateTodayUnformatted = url.split('edit_attendance/')[1]
  var dateTodayFormatted = dateTodayUnformatted.replace(/-/g, "");
  const selectChild = $('#input_child_member').selectize()
  const selectParent1 = $('#input_parent1_member').selectize()
  const selectParent2 = $('#input_parent2_member').selectize()
  const selectWitnessGMother = $('#input_member').selectize()
  const selectWitnessGFather = $('#input_witness_gfather_member').selectize()

  $('#add_non_member_button').click(function () {
    $('#nonMemberModal').modal('show')
    $('#witness_gfather_info_error').text('')
    $('#no-attendees-error').text('')
  })

  var addedWitness = false
  var witnessType = null

  initDate()

  function updateDatePickerDate() {
    for (i = 0; i < 8; i++) {
      if (i < 4)
        year += dateTodayFormatted[i]
      else if (i < 6)
        month += dateTodayFormatted[i]
      else
        day += dateTodayFormatted[i]
    }
  }

  updateDatePickerDate()



  $("#close-symbol-edit").click(function () {
    location.href = "/attendance_main_page"
  })

  $("#close-edit-btn").click(function () {
    location.href = "/attendance_main_page"
  })


  $("#delete-button").click(function () {

    $("#exampleModalCenter").modal('show')

    $("#delete-modal-text").html(`Delete the attendance record on ${day}/${month}/${year}?`)

    $("#delete-attendance-btn").click(function () {
      const data = {}
      data.date = new Date($('#date').val()).toISOString()
      $.ajax({
        type: 'DELETE',
        data: data,
        url: '/delete_attendance',
        success: function (result) {
          if (result) {
            window.location.reload(true)
          } else {
            $('#create-attendance').prop('disabled', false)
            alert('record doesnt exist')
          }
        }
      })
    })
  })

  $('select').change(hideChoices)


  // bind function to child member
  $('#child_member').change(function () {
    $('#child_non_member').prop('checked', false)
    $('#child_member_div').show()
    $('#child_non_member_div').hide()
    $('#child_first_name').val('')
    $('#child_mid_name').val('')
    $('#child_last_name').val('')
  })

  $('#witness_gmother_non_member').change(function () {
    $('#witness_gmother_member').prop('checked', false)
    $('#display_member_div').hide()
    $('#witness_gmother_non_member_div').show()
    selectizeEnable($('#input_member').val())
    $(selectWitnessGMother)[0].selectize.setValue('0')
  })

  // bind function to witness member
  $('#witness_gmother_member').change(function () {
    $('#witness_gmother_non_member').prop('checked', false)
    $('#witness_gmother_non_member_div').hide()
    $('#display_member_div').show()
    $('#witness_gmother_first_name').val('')
    $('#witness_gmother_mid_name').val('')
    $('#witness_gmother_last_name').val('')
  })

  $('#witness_gfather_non_member').change(function () {
    $('#witness_gfather_member').prop('checked', false)
    $('#witness_gfather_member_div').hide()

    selectizeEnable($('#input_witness_gfather_member').val())
    $(selectWitnessGFather)[0].selectize.setValue('0')
  })

  // bind function to witness member
  $('#witness_gfather_member').change(function () {
    $('#witness_gfather_non_member').prop('checked', false)

    $('#witness_gfather_member_div').show()
    $('#non_member_first_name').val('')
    $('#non_member_mid_name').val('')
    $('#non_member_last_name').val('')
  })

  // bind function to parent1 non member
  $('#parent1_non_member').change(function () {
    $('#parent1_member').prop('checked', false)
    $('#parent1_member_div').hide()
    $('#parent1_non_member_div').show()
    selectizeEnable($('#input_parent1_member').val())
    $(selectParent1)[0].selectize.setValue('0')
  })

  // bind function to parent1 member
  $('#parent1_member').change(function () {
    $('#parent1_non_member').prop('checked', false)
    $('#parent1_non_member_div').hide()
    $('#parent1_member_div').show()
    $('#parent1_first_name').val('')
    $('#parent1_mid_name').val('')
    $('#parent1_last_name').val('')
  })

  $('#parent2_non_member').change(function () {
    $('#parent2_member').prop('checked', false)
    $('#parent2_member_div').hide()
    $('#parent2_non_member_div').show()

    selectizeEnable($('#input_parent2_member').val())
    $(selectParent2)[0].selectize.setValue('0')

    $('#parent2_none').prop('checked', false)
  })

  $('#parent2_member').change(function () {
    $('#parent2_non_member').prop('checked', false)
    $('#parent2_non_member_div').hide()
    $('#parent2_member_div').show()
    $('#parent2_first_name').val('')
    $('#parent2_mid_name').val('')
    $('#parent2_last_name').val('')

    $('#parent2_none').prop('checked', false)
  })

  $('#parent2_none').change(function () {
    $('#parent2_non_member').prop('checked', false)
    $('#parent2_member').prop('checked', false)

    $('#parent2_non_member_div').hide()
    $('#parent2_member_div').hide()

    $('#parent2_first_name').val('')
    $('#parent2_mid_name').val('')
    $('#parent2_last_name').val('')

    selectizeEnable($('#input_parent2_member').val())
    $(selectParent2)[0].selectize.setValue('0')
    $('#parent2_info_error').text('')
  })

  $('#add_member').click(function () {
    var isValid = true

    var witnessMember = $('#input_member').val() === '0' || $('#input_member').val() === ''

    if (witnessMember) {
      isValid = false
      $('#witness_gmother_modal_info_error').text('Please accomplish all fields')
    } else {
      $('#witness_gmother_modal_info_error').text('')
    }

    if (isValid) {
      var witnessName
      if (witnessMember) {
        const firstName = $('#witness_gmother_first_name').val()
        const midName = $('#witness_gmother_mid_name').val()
        const lastName = $('#witness_gmother_last_name').val()
        $('#member_row').append(
          "<div class='col-4' style='margin-bottom: 1em;'>" +
          "<div class='card witness member'><div class='card-body'>" +
          "<p class='card-text member-text'>" +
          "<span class='first_name'>" + firstName + "</span> " +
          "<span class='mid_name'>" + midName + "</span> " +
          "<span class='last_name'>" + lastName + "</span>" +
          "</p>" +
          "<button type='button' class='fas fa-trash delMemberBtn '></button>" +
          "</div>" +
          "</div>" +
          "</div>")
      } else {
        const witness_info = $('#input_member').val().split(", ")
        const id_number = witness_info[1]
        const firstName = witness_info[2]
        const midName = witness_info[3]
        const lastName = witness_info[4]
        const member_id = witness_info[0]
        // witnessName = witnessName.replace(/,/g, '')
        $('#member_row').append(
          "<div class='col-4' style='margin-bottom: 1em;'>" +
          "<div class='card witness member'><div class='card-body'>" +
          "<p class='card-text member-text'>" +
          "<span class='first_name'>" + firstName + "</span> " +
          "<span class='mid_name'>" + midName + "</span> " +
          "<span class='last_name'>" + lastName + "</span>" +
          "<input type='hidden' class='id_number' value='" + id_number + "'>" +
          "<input type='hidden' class='id_member' value='" + member_id + "'>" +

          "</p>" +
          "<button type='button' class='fas fa-trash delMemberBtn '></button>" +
          "</div>" +
          "</div>" +
          "</div>")
      }
      $('#witness_gmother_info_error').text('')
      $('#witness_gfather_info_error').text('')
      $('#witness_gmother_first_name').val('')
      $('#witness_gmother_mid_name').val('')
      $('#witness_gmother_last_name').val('')

      addedWitness = true
      $('#memberModal').modal('hide');
    }
  })

  $('#add_non_member').click(function () {
    var isValid = true
    var firstNameAndLastName = $('#non_member_first_name').val() === '' || $('#non_member_last_name').val() === ''
    var nameMiddleLen = $('#non_member_mid_name').val().length
    var firstName = $("#non_member_first_name").val()
    var lastName = $("#non_member_last_name").val()

    if (hasNumber(firstName) || checkSpecialChar(firstName) || hasNumber(lastName) || checkSpecialChar(lastName)) {
      isValid = false
      $('#names_char_error').text('Names should only contain letters')
    }
    else {
      $('#names_char_error').text('')
    }

    if (firstNameAndLastName) {
      isValid = false
      $('#empty_names_error').text('Please accomplish all required fields')
    } else {
      $('#empty_names_error').text('')
    }


    if (nameMiddleLen > 1) {
      isValid = false
      $('#middle_name_single_error').text('Middle Initial should only contain 1 letter')

    } else {
      $('#middle_name_single_error').text('')
    }

    if (validateMidInitial($('#non_member_mid_name').val()) === false && nameMiddleLen != 0) {
      isValid = false
      $('#middle_name_char_error').text('Middle Initial should only contain letters')
    } else {
      $('#middle_name_char_error').text('')
    }

    if (isValid) {
      const firstName = $('#non_member_first_name').val()
      const midName = $('#non_member_mid_name').val()
      const lastName = $('#non_member_last_name').val()
      $('#non_member_row').append(
        "<div class='col-4' style='margin-bottom: 1em;'>" +
        "<div class='card witness non-member'><div class='card-body'>" +
        "<p class='card-text non-member-text'>" +
        "<span class='first_name'>" + firstName + "</span> " +
        "<span class='mid_name'>" + midName + "</span> " +
        "<span class='last_name'>" + lastName + "</span>" +
        "</p>" +
        "<button type='button' class='fas fa-trash delNonMemberBtn '></button>" +
        "</div>" +
        "</div>" +
        "</div>")

      $('#witness_gfather_info_error').text('')
      $('#witness_gmother_info_error').text('')
      $('#non_member_first_name').val('')
      $('#non_member_mid_name').val('')
      $('#non_member_last_name').val('')

      addedWitness = true
      $('#nonMemberModal').modal('hide');
    }
  })

  $('#add_member_button').click(function () {
    $('#memberModal').modal('show')
    $('#witness_gmother_info_error').text('')
    $('#no-attendees-error').text('')
  })


  $(document).on('click', '.delMemberBtn', function () {
    const member = $(this).closest('.card').attr('data-member-info')
    if (member !== null) {
      selectizeEnable(member)
    }
    $(this).closest('.col-4').remove()
  })

  $(document).on('click', '.delNonMemberBtn', function () {
    const member = $(this).closest('.card').attr('data-member-info')
    if (member !== null) {
      selectizeEnable(member)
    }
    $(this).closest('.col-4').remove()
  })

  $('.modal').on('hide.bs.modal', resetModal)

  /**
   * This function hides the selected choice for all select fields to avoid duplication of choices
   */
  function hideChoices() {
    var previous = $(this).data('previous')
    var currOption = $(this).val()
    selectizeDisable(currOption)
    $(this).data('previous', currOption)

    // if there was a previously selected choice, free up from other input fields
    if (previous !== null || previous !== undefined) {
      selectizeEnable(previous)
    }
  }

  function resetModal() {
    $('#non_member_first_name').val('')
    $('#non_member_mid_name').val('')
    $('#non_member_last_name').val('')
  }

  function validateFields() {
    var isValid = true

    var nonMembers = $('#non_member_row').children().length
    var members = $('#member_row').children().length

    if (nonMembers < 1 && members < 1) {
      isValid = false
      $('#no-attendees-error').text('Please add an attendee')
    } else {
      $('#no-attendees-error').text('')
    }

    return isValid
  }


  function selectizeEnable(data) {
    $('#input_child_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_parent1_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_parent2_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_witness_gfather_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
  }

  function selectizeDisable(data) {
    $('#input_child_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_parent1_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_parent2_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_witness_gfather_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
  }

  function initDate() {
    var url = window.location.href
    var dateToday = url.split('edit_attendance/')[1]
    var today = new Date(dateToday);
    $('#date').val(today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0'))
  }

  // used to validate middle initial
  function validateMidInitial(mid) {
    const re = /^[A-Z]/
    return re.test(mid)
  }



  function convertMonth(month) {
    switch (month) {
      case 'January':
        return '01';
      case 'February':
        return '02';
      case 'March':
        return '03';
      case 'April':
        return '04';
      case 'May':
        return '05';
      case 'June':
        return '06';
      case 'July':
        return '07';
      case 'August':
        return '08';
      case 'September':
        return '09';
      case 'October':
        return '10';
      case 'November':
        return '11';
      case 'December':
        return '12';
    }
  }

  function checkSelectedDate() {
    var selectedDate = $(".e-selected").children("span").attr("title")

    if (selectedDate == undefined || selectedDate == null || selectedDate == "") {
      $("#error-date").css("color", "red")
      return false
    }
    else {
      return true
    }
  }

  $('#create-attendance').click(function () {

    $('#create-attendance').prop('disabled', true)
    if (validateFields()) {
      const data = {
        attendees: []
      }

      const nonMembers = $('.non-member-text')
      for (nonMember of nonMembers) {
        const currNonMember = {}

        currNonMember.first_name = $(nonMember).find('.first_name').text()
        currNonMember.mid_name = $(nonMember).find('.mid_name').text()
        currNonMember.last_name = $(nonMember).find('.last_name').text()
        currNonMember.attendance_id = $(nonMember).children('.id_attendance').val()
        data.attendees.push(currNonMember)
      }

      const members = $('.member-text')
      for (member of members) {
        const currMember = {}

        currMember.person_id = $(member).children('.id_number').val()
        currMember.attendance_id = $(member).children('.id_attendance').val()
        currMember.member_id = $(member).children('.id_member').val()

        data.attendees.push(currMember)
      }

      data.date = $('#date').val()
      data.attendees = JSON.stringify(data.attendees)

      $.ajax({
        type: 'PUT',
        data: data,
        url: '/update_attendance',
        success: function (result) {
          if (result) {
            location.href = '/view_attendance/' + $('#date').val()
          } else {
            $('#create-attendance').prop('disabled', false)
            alert('An error occured')
          }
        }
      })
    } else {
      $('#create-attendance').prop('disabled', false)
    }
  })

  function validateMidInitial(mid) {
    const re = /[A-Za-z]/
    return re.test(mid)
  }

  $('#close_modal_non_member').click(function () {
    $('#empty_names_error').text('')
    $('#middle_name_single_error').text('')
    $('#middle_name_char_error').text('')
    $('#names_char_error').text('')
  })

  $('#close_modal_exit_btn').click(function () {
    $('#empty_names_error').text('')
    $('#middle_name_single_error').text('')
    $('#middle_name_char_error').text('')
    $('#names_char_error').text('')
  })

  function checkSpecialChar(str) {
    var regex = /[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]/g;
    return regex.test(str);
  }

  function hasNumber(str) {
    return /\d/.test(str);
  }
})


