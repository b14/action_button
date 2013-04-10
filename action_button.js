/*jshint forin:false, jquery:true, browser:true, indent:2, trailing:true, unused:false */
/*global Drupal */

(function ($) {
  'use strict';


  var Ding = Ding || {};
  Drupal.ajax = Drupal.ajax || {};

  // Action button class
  Ding.ActionButton = function(element, options) {
    var $elem = $(element),
        $obj = this,
        $link = $elem.find('a.toggler'),
        $content = $elem.find('.action-content'),
        $message = $elem.find('.action-message'),
        $settings = $.extend({
          param: 'defaultValue'
        }, options || {});
    /**
     * Set list position.
     */
    function _set_list_position() {
      var
        _scrollTop = window.scrollY || document.documentElement.scrollTop,
        _distance = 0,
        _content_height = $content.outerHeight(true),
        _container_height = $elem.height(),
        _content_top = Math.floor((_container_height - _content_height) / 2),
        header_height = $('header#header').height();

      if ($('header#header').css('position') == 'static') {
        header_height = 0;
      }

      $content.css('top', _content_top);

      _distance = $content.offset().top - _scrollTop;

      if (_distance < header_height && _distance > 0) {
        if (_content_height > _container_height) {
          $content.css('top', Math.min(
            0,
            _content_top + Math.abs(_distance - header_height)
          ));
        } else {
          $content.css('top', Math.min(
            (_container_height - _content_height) * 2,
            _content_top + Math.abs(_distance - header_height)
          ));
        }
      } else if (_distance + _content_height > $(window).height()) {
        if (_content_height > _container_height) {
          $content.css('top', Math.max(
            _container_height - _content_height,
            _content_top - ((_distance + _content_height) - $(window).height())
          ));
        } else {
          $content.css('top', Math.max(
            (_content_height - _container_height) - 1,
            _content_top - ((_distance + _content_height) - $(window).height())
          ));
        }
      }
      else if (_distance < 0) {
        if ($content.closest('#header').length > 0) {
          $content.css('top', Math.min(
            0,
            _content_top + Math.abs(_distance)
          ));
        } else {
          $content.css('top', 0);
        }
      }

      $content.css('left', '');
      $elem.removeClass('lefty center');
      if ($content.outerWidth(true) + $content.offset().left > $(window).width()) {
        if ($elem.offset().left - $content.outerWidth(true) > 0) {
          $elem.addClass('lefty');
        } else {
          $elem.addClass('center');
          $content.css('left', ((($(window).width() - $content.outerWidth(true)) / 2) - $elem.offset().left) + 'px');
        }
      }
    }

    return {
      setup: function() {
        // Set the toggler to perform the opening and closing of the list.
        // Note that the ajax API takes care of loading.
        $link.click(function (e) {
          // Close all other open action buttons
          var $other_buttons = $('.action-button.result, .action-button.open, .action-button-group.open').not($elem); //.removeClass('open result');
          $other_buttons.removeClass('result open')

          if ($other_buttons.hasClass('group-button')) {
            $other_buttons.actionbutton().reset();
          }

          $elem.removeClass('result');

          if (!$elem.hasClass('processed')) {
            $elem.find('.action-list').html('');
            $elem.removeClass('open');
          } else {
            if ($elem.hasClass('open')) {
              $elem.removeClass('open');
              $('body').unbind('click', bodyClicker);
              if ($elem.hasClass('group-button')) {
                $elem.find('.action-list').html('');
              }
            } else {
              $elem.addClass('open');
              _set_list_position();
              $('body').bind('click', bodyClicker);
            }
          }

          if (!$elem.hasClass('group-button')) {
            $elem.addClass('processed');
          }
        });

        // Set the toggler text holder to do the same as the actual toggler.
        $elem.find('a.toggler-text').click(function (e) {
          e.preventDefault();
          $link.click();
        });
      },
      getLinkId: function() {
        return $link.attr('id');
      },
      set_list_position: function() {
        _set_list_position();
        return true;
      },
      setMessage: function(_message) {
        $message.html(_message);
        $elem
          .addClass('result')
          .removeClass('open');
        _set_list_position();
        return true;
      },
      showMessage: function() {
        $elem
          .addClass('result')
          .removeClass('open');
        _set_list_position();
        return true;
      },
      reset: function() {
        $elem
          .removeClass('processed');
      },
      setName: function(_name) {
        $elem.find('.action-button-title a').text(_name);
      }
    };
  };

  // Add action button instance
  $.fn.actionbutton = function(options) {
    if (arguments.length > 0) {
      var func_name = arguments[0], args = [];
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return $.fn.encapsulatedPlugin('actionbutton', Ding.ActionButton, this, options)[func_name].apply(this, args);
    }
    return $.fn.encapsulatedPlugin('actionbutton', Ding.ActionButton, this, options);
  };

  function bodyClicker(e) {
    if ($(e.target).closest('.action-button').length === 0) {
      var $action_button = $('.action-button.open, .action-button.result');
      $action_button.removeClass('result open')

      if ($action_button.hasClass('group-button')) {
        $action_button.actionbutton().reset();
      }
      $('body').unbind('click', bodyClicker);
    }
  }
  /**
   * Attaches the behavior handling the action buttons.
   *
   * This Includes both setting up the actual action button, and the action
   * menu lists.
   */
  Drupal.behaviors.checkbox_handler = {
    attach: function (context, settings) {
      $("div[class='checkbox-wrapper']", context).addClass("unchecked");
      $(".checkbox-wrapper", context).each(function() {
        if($(this).children("input").attr("checked")) {
          $(this).removeClass("unchecked");
    			$(this).addClass("checked");
        }
      });
    	$(".checkbox-wrapper", context).click(function(){
    		if($(this).children("input").attr("checked")){
    			// uncheck
    			$(this).children("input").attr({checked: ""});
    			$(this).removeClass("checked");
    			$(this).addClass("unchecked");
    		}else{
    			// check
    			$(this).children("input").attr({checked: "checked"});
    			$(this).removeClass("unchecked");
    			$(this).addClass("checked");
    		}
    	});
    }
  }
  /**
   * Attaches the behavior handling the action buttons.
   *
   * This Includes both setting up the actual action button, and the action
   * menu lists.
   */
  Drupal.behaviors.action_button_handler = {
    attach: function (context, settings) {
      
      //
      // Setup the action buttons.
      // We should change the action-button-group to something else when group
      // is implemented.
      $('.action-button', context).each(function (i, action_button) {
        var
          $action_button = $(action_button),
          link_id = $action_button.actionbutton().getLinkId();

        if(Drupal.ajax[link_id]) {
          Drupal.ajax[link_id].eventResponse = customEventResponse;

          if ($action_button.hasClass('group-button')) {
            var beforeSerialize = Drupal.ajax[link_id].beforeSerialize;
            Drupal.ajax[link_id].beforeSerialize = function (element, options) {
              beforeSerialize(element, options);
              groupBeforeSerialize(options, $action_button.attr('ref'));
            }
          }
        }
      });

      if(settings.message && settings.selector) {
        $(settings.selector).actionbutton().setMessage(settings.message);
        // Drupal.attachBehaviors($(settings.selector), settings);
      }

      if (settings.extra_class) {
        if (settings.selector) {
          $(settings.selector).addClass(settings.extra_class);
        }
      }

      // Refresh means that next time you open the specific actionbutton, the
      // list should refresh and not use the list cached in the DOM.
      if (settings.refresh === true) {
        if(settings.selector) {
          $(settings.selector).actionbutton().reset();
        } else {
          $(context).closest('.action-button').actionbutton().reset();
        }
      }
      // This removes a selector.
      // Looks for the selector by going upwards through the DOM tree (starting
      // at the $action_button).
      if (settings.remove) {
        $(settings.selector).closest(settings.remove).fadeOut(1000, function () {
          $(this).remove();
        });
      }

      // Center the action list.
      if ($(context).hasClass('action-list')) {
        var
          $action_button = context.closest('.action-button');

        if ($action_button.length === 0) {
          return;
        }

        $action_button.addClass('open');
        $action_button.actionbutton().set_list_position();

        $('body').bind('click', bodyClicker);

        if ($action_button.hasClass('group-button')) {
          $('.action-list-item', $action_button).each(function (i, item) {
            var
              $item = $(item),
              link_id = $item.attr('id'),
              beforeSerialize = Drupal.ajax[link_id].beforeSerialize;

              Drupal.ajax[link_id].beforeSerialize = function (element, options) {
                beforeSerialize(element, options);
                groupBeforeSerialize(options, $action_button.attr('ref'));
              }
          });
        }
      }

      // Make sure the action button is placed correct while scrolling.
      // The timeout is so we're sure this scroll event always is called last
      // so after any other event has altered the DOM.
      setTimeout(function () {
        $(window)
          .unbind('scroll', onScroll)
          .bind('scroll', onScroll);
          
          onScroll();
      }, 0);
      onScroll();
    }
  };
  
  function onScroll(e) {
    $('.action-button.open, .action-button.result').each(function (i, action_button) {
      $(action_button).actionbutton().set_list_position();
    });
  }

  /**
   * This function is called when action list items using ajax callbacks, gets
   * a return from the server.
   */
  function action_button_ajax_success($action_button, data) {
    // Jump ship if there's no data.
    if (data === null) {
      return;
    }

    // When developing, this helps to speed up debugging.
    if (data.dev) {
      console.log($action_button, data);
    }

    // Set the message.
    if (data.message && $action_button.find('.action-message').length > 0) {
      var $message = $('<span>' + data.message + '</span>');
      Drupal.attachBehaviors($message, Drupal.settings);

      $($action_button).actionbutton().setMessage($message); //.hide().fadeIn())
    }

    // Refresh means that next time you open the specific actionbutton, the
    // list should refresh and not use the list cached in the DOM.
    if (data.refresh === true) {
      $action_button.actionbutton().reset();
    }

    // This removes a selector.
    // Looks for the selector by going upwards through the DOM tree (starting
    // at the $action_button).
    if (data.remove) {
      $action_button.closest(data.remove).remove();
    }
  }

  function getGroupIds(group) {
    var
      ids = [],
      $checked = $('input[name="' + group +'"]:checked');

    if ($checked.length === 0) {
      $checked = $('input[name="' + group +'"]');
      ids.push('all');
    }

    $checked.each(function (i, checkbox) {
      ids.push($(checkbox).val());
    });

    return ids;
  }

  function groupBeforeSerialize(options, group) {
    options['data']['ids'] = getGroupIds(group);
  }


  /**
   * A custom eventResponse, we use for our Drupal.AJAX objects.
   *
   * it's basically a copy of the eventResponse function from the core ajax.js
   * file, we've just removed core comments and added an extra check for our
   * own processed class so we can use the DOM cache.
   */
  function customEventResponse(element, event) {
    var
      ajax = this,
      $action_button = $(element).closest('.action-button');

    // This is the only difference.
    // Do not perform another ajax command if one is already in progress.
    if (ajax.ajaxing
      || ($action_button.hasClass('processed') && !$action_button.hasClass('group-button'))
      || ($action_button.hasClass('group-button') && $action_button.hasClass('open'))
    ) {
      return false;
    }

    try {
      if (ajax.form) {
        if (ajax.setClick) {
          element.form.clk = element;
        }

        ajax.form.ajaxSubmit(ajax.options);
      }
      else {
        ajax.beforeSerialize(ajax.element, ajax.options);
        $.ajax(ajax.options);
      }
    }
    catch (e) {
      ajax.ajaxing = false;
      alert("An error occurred while attempting to process " + ajax.options.url + ": " + e.message);
    }

    if (typeof element.type !== 'undefined' && (element.type === 'checkbox' || element.type === 'radio')) {
      return true;
    }
    else {
      return false;
    }
  }

}(jQuery));