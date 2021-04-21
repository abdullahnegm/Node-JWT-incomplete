function unfollow(follows, id) {
  //   follows = Object.values(follows);
  console.log("got there ", typeof follows, id);
  let post_unfollow = follows.filter((follower) => follower != id);
  console.log("far: ", post_unfollow);
  return post_unfollow;
}

module.exports = unfollow;
