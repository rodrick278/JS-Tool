const useInfiniteScroll = (service, opt = {}) => {
  const obRef = useRef(null);
  const [noMore, setNoMore] = useState(false);
  const [data, setData] = useState({
    list: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dom = opt.target?.current;
    if (!dom || noMore) return;
    if (obRef.current) {
      obRef.current.disconnect();
    }
    obRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleService();
      }
    });

    obRef.current.observe(dom);
  }, [opt.ref?.current, data, noMore]);

  const handleService = async () => {
    setLoading(true);
    try {
      const d = await service(data);
      const newData = {
        list: [...data.list, ...d.list],
        total: d.total,
      };
      if (opt.isNoMore(newData)) {
        setNoMore(true);
        obRef.current.disconnect();
      }

      setData(newData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    noMore,
    data,
    loading,
  };
};


//use
const ref = useRef();
const { data, loading, noMore } = useInfiniteScroll(
  (d) => {
    console.log("service", d);
    const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1;
    return getTableData(page);
  },
  {
    target: ref,
    isNoMore: (d) => {
      return d?.total <= d?.list.length;
    },
  }
);
