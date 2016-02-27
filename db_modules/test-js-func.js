import R from 'ramda';

export default function() {
    return R.reduce(R.max, -Infinity, [1, 10, 3]);
}
