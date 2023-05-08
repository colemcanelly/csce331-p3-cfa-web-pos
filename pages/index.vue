<template>
  <div></div>
</template>

<script>
export default {
  name: "IndexPage",

  mounted: function () {
    console.log("running get permissions")
    let url = "/login";
    let perm = null;
    try {
      perm = this.$cookies.get("permissions");
      console.log(perm);
    } catch (error) {
      url = "/login";
    }
    if (perm === null) url = "/login";
    else if (perm == 0) url = "/customer/categories";
    else if (perm == 1) url = "/server";
    else if (perm == 2) url = "/managerMenu";
    else console.log("Error getting user permissions");
    this.$router.push(url);
  },
};
</script>
