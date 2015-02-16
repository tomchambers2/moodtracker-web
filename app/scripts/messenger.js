angular.module('variantTools', [])

.service('messenger', [function() {
  return {
    warning: toastr.warning,
    error: toastr.error,
    success: toastr.success
  };
}]);