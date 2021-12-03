$(document).ready(function() {
  var GMotherWitnessCtr = 0
  var GFatherWitnessCtr = 0
  var addedWitness = false
  var witnessType = null
  const selectChild = $('#input_child_member').selectize()
  const selectParent1 = $('#input_parent1_member').selectize()
  const selectParent2 = $('#input_parent2_member').selectize()
  const selectWitnessGMother = $('#input_member').selectize()
  const selectWitnessGFather = $('#input_witness_gfather_member').selectize()

  $('#add_non_member_button').click(function() {
      $('#nonMemberModal').modal('show')
      $('#no-attendees-error').text('')
      $('#witness_gfather_info_error').text('')
  })

  var addedWitness = false
  var witnessType = null

  initDate()

  
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

  $('#witness_gmother_non_member').change(function() {
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

  $('#witness_gfather_non_member').change(function() {
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
  $('#parent1_non_member').change(function() {
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

  $('#create-attendance').click(function (){
      console.log("trgger")
    $('#create-attendance').prop('disabled', true)
    if(validateFields()) {
      const data = {
        attendees: []
      }
      console.log('reached')
      
      const nonMembers = $('.non-member-text')
      for (nonMember of nonMembers) {
        const currNonMember = {}

        currNonMember.first_name = $(nonMember).find('.first_name').text()
        currNonMember.mid_name = $(nonMember).find('.mid_name').text()
        currNonMember.last_name = $(nonMember).find('.last_name').text()

        data.attendees.push(currNonMember)
      }

      const members = $('.member-text')
      for (member of members) {
        const currMember = {}

        currMember.person_id = $(member).children('.id_number').val()

        data.attendees.push(currMember)
      }

      data.date = new Date($('#date').val()).toISOString()
      data.attendees = JSON.stringify(data.attendees)

      console.log(data.members)

      $.ajax({
        type: 'POST',
        data: data,
        url: '/create_attendance',
        success: function (result){
          console.log(result)
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

  $('#add_member').click(function (){
    var isValid = true
    
    var witnessMember = $('#input_member').val() === '0' || $('#input_member').val() === ''
    
    if (witnessMember) {
      isValid = false
      $('#witness_gmother_modal_info_error').text('Please accomplish all fields')
    } else {
      $('#witness_gmother_modal_info_error').text('')
    }

    if(isValid) {
      const witness_info = $('#input_member').val().split(", ")
      console.log(witness_info)
      const id_number = witness_info[1]
      const firstName = witness_info[2]
      const midName = witness_info[3]
      const lastName = witness_info[4]
      $('#member_row').append(
        "<div class='col-4' style='margin-bottom: 1em;'>" +
          "<div class='card witness female'><div class='card-body'>" + 
            "<p class='card-text member-text'>" + 
              "<span class='first_name'>" + firstName + "</span> " + 
              "<span class='mid_name'>" + midName + "</span> " + 
              "<span class='last_name'>" + lastName + "</span>" + 
              "<input type='hidden' class='id_number' value='" + id_number +"'>" + 
            "</p>" +
            "<button type='button' class='fas fa-trash delGMotherWitnessBtn '></button>" + 
          "</div>" + 
        "</div>" + 
      "</div>")
      $('#witness_gmother_info_error').text('')
      $('#witness_gfather_info_error').text('')
      $('#witness_gmother_first_name').val('')
      $('#witness_gmother_mid_name').val('')
      $('#witness_gmother_last_name').val('')
      GMotherWitnessCtr++;
      
      addedWitness = true
      $('#memberModal').modal('hide');
    }
  })

  $('#add_non_member').click(function (){
    var isValid = true
    var witnessNonMember = $('#non_member_first_name').val() === '' || $('#non_member_mid_name').val() === '' || $('#non_member_last_name').val() === ''
    var witnessMiddleLen = $('#non_member_mid_name').val().length === 1

    if (witnessNonMember) {
      isValid = false
      $('#witness_gfather_modal_info_error').text('Please accomplish all fields')
    } else {
      $('#witness_gfather_modal_info_error').text('')
    }
    if (!witnessNonMember && !witnessMiddleLen) {
      isValid = false
      $('#witness_gfather_modal_middle_len_error').text('Middle Initial should only contain 1 letter')
    } else {
      $('#witness_gfather_modal_middle_len_error').text('')
    }

    if (witnessNonMember === false && validateMidInitial($('#non_member_mid_name').val()) === false) {
      isValid = false
      $('#witness_gfather_modal_middle_error').text('Middle Initial should only range from letters A-Z')
    } else {
      $('#witness_gfather_modal_middle_error').text('')
    }


    if(isValid) {
        const firstName = $('#non_member_first_name').val()
        const midName = $('#non_member_mid_name').val()
        const lastName = $('#non_member_last_name').val()
        $('#gfather_witness_row').append(
          "<div class='col-4' style='margin-bottom: 1em;'>" +
            "<div class='card witness male'><div class='card-body'>" + 
              "<p class='card-text non-member-text'>" + 
                "<span class='first_name'>" + firstName + "</span> " + 
                "<span class='mid_name'>" + midName + "</span> " + 
                "<span class='last_name'>" + lastName + "</span>" + 
              "</p>" +
              "<button type='button' class='fas fa-trash delGFatherWitnessBtn '></button>" + 
            "</div>" + 
          "</div>" + 
        "</div>")
      
      $('#witness_gfather_info_error').text('')
      $('#witness_gmother_info_error').text('')
      $('#non_member_first_name').val('')
      $('#non_member_mid_name').val('')
      $('#non_member_last_name').val('')
      GFatherWitnessCtr++;
      
      addedWitness = true
      $('#nonMemberModal').modal('hide');
    }
  })

  $('#add_member_button').click(function() {
    $('#memberModal').modal('show')
    $('#witness_gmother_info_error').text('')
    $('#no-attendees-error').text('')
    isMaleModal = false
  })


  $(document).on('click', '.delGMotherWitnessBtn', function () {
    const member = $(this).closest('.card').attr('data-member-info')
    if (member !== null) {
      selectizeEnable(member)
    }
    $(this).closest('.col-4').remove()
    GMotherWitnessCtr--
  })

  $(document).on('click', '.delGFatherWitnessBtn', function () {
    const member = $(this).closest('.card').attr('data-member-info')
    if (member !== null) {
      selectizeEnable(member)
    }
    $(this).closest('.col-4').remove()
    GFatherWitnessCtr--
  })

  $('.modal').on('hide.bs.modal', resetModal)
  

  /**
   * 
   * @param {jQuery Object} memberBox the member checkfield
   * @param {jQuery Object} selectField the select field
   * @param {jQuery Object} firstNameField the first name field
   * @param {jQuery Object} midNameField the middle name field
   * @param {jQuery Object} lastNameField  the last name field
   * @returns 
   */
  function getDetails(memberBox, selectField, firstNameField, midNameField, lastNameField) {
    const person = {}

    person.isMember = $(memberBox).is(':checked')

    if (person.isMember) {
      const info = $(selectField).find(':selected').val().split(', ')
      person.person_id = info[1]
      person.member_id = info[0]
    } else {
      person.first_name = $(firstNameField).val()
      person.mid_name = $(midNameField).val()
      person.last_name = $(lastNameField).val()
    }
    return person
  }

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

    var nonMembers = $('#gfather_witness_row').children().length
    var members = $('#member_row').children().length
    
    if (nonMembers == 1 && members == 1) {
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

  function initSelectize() {
    $(selectChild)[0].selectize.refreshOptions()
    $(selectParent1)[0].selectize.refreshOptions()
    $(selectParent2)[0].selectize.refreshOptions()
    $(selectWitnessGMother)[0].selectize.refreshOptions()
    $(selectWitnessGFather)[0].selectize.refreshOptions()

    $('.selectize-dropdown').hide();
    $('.selectize-input').removeClass('focus input-active dropdown-active');
    $('div.selectize-input > input').blur();
  }

  function initDate() {
    const today = new Date()
    $('#date').val(today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0'))
    
  }
  
  // used to validate middle initial
  function validateMidInitial (mid) {
    const re = /^[A-Z]/
    return re.test(mid)
  }
})


